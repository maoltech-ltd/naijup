"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@nextui-org/react"
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import EditorJS from "@editorjs/editorjs";
import { TPost } from "@/src/utils/props";
import { BackIcon } from "../icon";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { createPost } from "@/src/redux/slice/postSlice";
import { useSelector } from "react-redux";
import { createImage } from "@/src/redux/slice/ImageSlice";
// import { convertImageToBase64 } from "@/utils/convertImageTobase64";

// type TForm = {
//   title: string;
//   image: Blob | MediaSource;
//   postType: "DRAFT" | "PUBLISHED";
// };

const Editor = ({ post, user }: { post: any | null, user: any }) => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<any>({ defaultValues: { title: post?.title } });
  const postType = watch("postType");

  const [imageFile, setImageFile] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  const ref = useRef<EditorJS | undefined>(undefined);

  const { status: imageStatus, image: uploadedImage } = useSelector((state: any) => state.image);

  useEffect(() => {
    if (errors.title) {
      console.log("Title can't be empty!");
    }
  }, [errors.title]);

  const onSubmitHandler: SubmitHandler<any> = async (data) => {
    try {
      const blocks = await ref.current?.save();
      let imageUrl = post?.image;
      if(imageFile){
        const imageUrl = await dispatch(createImage(imageFile)).unwrap()
        console.log({imageUrl});
      }

      const postData = {
        title: data.title,
        content: blocks,
        image: imageUrl,
        type: data.postType,
        author: user.id,
      };

      await dispatch(createPost(postData))

    reset();
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    // const convertedImage = await convertImageToBase64(file);
    setImageFile(file);
  };

  const initEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Table = (await import("@editorjs/table")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Quote = (await import("@editorjs/quote")).default;
    const Raw = (await import("@editorjs/raw")).default;
    const CheckList = (await import("@editorjs/checklist")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        placeholder: "Write your post content here...",
        inlineToolbar: true,
        data: post?.content,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a header",
              levels: [2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
          },
          list: List,
          checkList: CheckList,
          embed: Embed,
          linkTool: LinkTool,
          inlineCode: InlineCode,
          table: Table,
          quote: Quote,
          code: Code,
          raw: Raw,
        },
        onReady: () => {
          ref.current = editor;
        },
      });
    }
  }, [post]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initEditor();

      return () => {
        ref.current && ref.current.destroy;
        ref.current === undefined;
      };
    }
  }, [isMounted, initEditor]);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="h-full">
      <nav className="bg-transparent flex justify-between md:px-6 px-2 py-2 items-center">
        <Button
          radius="sm"
          variant="light"
          aria-label="Back button"
          onPress={() => router.back()}
        >
          <BackIcon name="chevron-left" /> back
        </Button>

        {post && post.type === "PUBLISHED" ? (
          <div>
            <Button
              variant="light"
              color="primary"
              radius="sm"
              type="submit"
              isDisabled={
                postType === "PUBLISHED" && isSubmitting ? true : false
              }
              isLoading={
                postType === "PUBLISHED" && isSubmitting ? true : false
              }
              onClick={() => setValue("postType", "PUBLISHED")}
            >
              {postType === "PUBLISHED" && isSubmitting
                ? "Saving..."
                : "Save changes"}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              variant="light"
              color="primary"
              radius="sm"
              type="submit"
              isDisabled={postType === "DRAFT" && isSubmitting ? true : false}
              isLoading={postType === "DRAFT" && isSubmitting ? true : false}
              onClick={() => setValue("postType", "DRAFT")}
            >
              {postType === "DRAFT" && isSubmitting
                ? "Saving..."
                : "Save Draft"}
            </Button>
            <Button
              color="primary"
              radius="sm"
              type="submit"
              isDisabled={
                postType === "PUBLISHED" && isSubmitting ? true : false
              }
              isLoading={
                postType === "PUBLISHED" && isSubmitting ? true : false
              }
              onClick={() => setValue("postType", "PUBLISHED")}
            >
              {postType === "PUBLISHED" && isSubmitting
                ? "publishing..."
                : "Publish"}
            </Button>
          </div>
        )}
      </nav>

      <div className="max-md:px-4 h-full overflow-y-auto">
        <div className="max-w-[650px] m-auto">
          <div className="flex gap-8 ">
            {!imageFile && (
              <input
                type="file"
                {...register("image")}
                onChange={handleImage}
              />
            )}
            {imageFile && (
              <figure className="relative w-full h-[300px] pt-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="absolute -top-2 -right-4 text-red-500 "
                  onClick={() => {
                    setImageFile(null), 
                    resetField("image");
                  }}
                >
                  <BackIcon name="x" />
                </Button>
                <Image
                  src={URL.createObjectURL(imageFile)}
                  width={100}
                  height={100}
                  alt="post image"
                  className="w-full h-full object-cover"
                />
              </figure>
            )}
            {post && post.image !== null && !imageFile && (
              <Image
                src={post.image}
                alt={post.title}
                width={100}
                height={100}
              />
            )}
          </div>
          <TextareaAutosize
            {...register("title", { required: true })}
            aria-label="Post Title"
            placeholder="New post title here..."
            className="lg:text-5xl md:text-4xl text-3xl leading-tight resize-none w-full md:font-extrabold font-bold outline-none text-[rgb(68, 64, 60)]"
          />
        </div>
        <div id="editor" className="prose max-w-full" />
      </div>
    </form>
  );
};

export default Editor;

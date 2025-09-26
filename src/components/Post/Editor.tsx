"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@nextui-org/react";
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EditorJS from "@editorjs/editorjs";
import { BackIcon } from "../icon";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { createPost, updatePost } from "@/src/redux/slice/postsSlice";
import { useSelector } from "react-redux";
import { createImage } from "@/src/redux/slice/ImageSlice";
import { categories } from "@/src/utils/props";
import { UserState } from "@/src/redux/slice/userSlice";
import { Post } from "@/src/redux/slice/postSlice";

const Editor = ({ post, user }: { post: Post | null; user: UserState }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<any>({ defaultValues: { title: post?.title, category: post?.category } });

  const postType = watch("postType");
  const [imageFile, setImageFile] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const ref = useRef<EditorJS | undefined>(undefined);

  const { status: imageStatus, image: uploadedImage } = useSelector(
    (state: any) => state.image
  );

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        category: post.category
      });
      setTags(post.tags || []);
    }
  }, [post, reset]);

  useEffect(() => {
    if (errors.title) {
      console.log("Title can't be empty!");
    }
  }, [errors.title]);

  function getPostDiff(original: Post, updated: any) {
    const changes: Record<string, { old: any; new: any }> = {};

    for (const key of [
      "title",
      "category",
      "tags",
      "content",
      "image_links",
    ]) {
      const oldVal = JSON.stringify((original as any)[key]);
      const newVal = JSON.stringify(updated[key]);

      if (oldVal !== newVal) {
        changes[key] = {
          old: (original as any)[key],
          new: updated[key],
        };
      }
    }
    return changes;
  }

  const onSubmitHandler: SubmitHandler<any> = async (data) => {
    try {
      const blocks = await ref.current?.save();
      let imageUrl = post?.image_links;

      if (imageFile) {
        const uploadedImageUrl = await dispatch(
          createImage(imageFile)
        ).unwrap();
        imageUrl = uploadedImageUrl.url;
      }

      const postData = {
        title: data.title,
        content: blocks?.blocks,
        image_links: imageUrl,
        type: data.postType,
        category: data.category,
        author: user.userId,
        tags: tags,
      };

      if (post) {
        const changes = getPostDiff(post, postData);
        console.log("Changes detected:", changes);
        await dispatch(updatePost({ ...postData, id: post.id }));
      } else {
        await dispatch(createPost({ post: postData, token: user.token }));
      }

      reset();
      router.push(`/blog/${data.title}`);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setImageFile(file);
  };

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
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
    const ImageTool = (await import("@editorjs/image")).default;

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
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  try {
                    const uploadedImageUrl = await dispatch(
                      createImage(file)
                    ).unwrap();
                    return {
                      success: 1,
                      file: {
                        url: uploadedImageUrl.url,
                      },
                    };
                  } catch (error) {
                    console.log("Image upload error:", error);
                    return {
                      success: 0,
                      file: {
                        url: "",
                      },
                    };
                  }
                },
              },
            },
          },
        },
        onReady: () => {
          ref.current = editor;
        },
      });
    }
  }, [post, dispatch]);

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
          <BackIcon name="chevron-left dark:text-light" />{" "}
          <div className="dark:text-light">Back</div>
        </Button>

        <div className="flex items-center gap-4">
        {/* <Button
            variant="light"
            color="primary"
            radius="sm"
            type="submit"
            isDisabled={postType === "DRAFT" && isSubmitting ? true : false}
            isLoading={postType === "DRAFT" && isSubmitting ? true : false}
            onClick={() => setValue("postType", "DRAFT")}
          >
            <div className="dark:text-light">
              {" "}
              {postType === "DRAFT" && isSubmitting
                ? "Saving..."
                : "Save Draft"}
            </div>
          </Button> */}
          <Button
            color="primary"
            radius="sm"
            type="submit"
            isDisabled={postType === "PUBLISHED" && isSubmitting ? true : false}
            isLoading={postType === "PUBLISHED" && isSubmitting ? true : false}
            onClick={() => setValue("postType", "PUBLISHED")}
          >
            <div className="dark:text-light">
              {postType === "PUBLISHED" && isSubmitting
                ? "Publishing..."
                : "Publish"}
            </div>
          </Button>
        </div>
      </nav>

      <div className="max-md:px-4 h-full overflow-y-auto">
        <div className="max-w-[650px] m-auto">
          {/* 🔥 NEW: diff preview for edit mode */}
          {post && (
            <div className="my-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
              <h4 className="font-bold mb-2 text-lg">Changes Preview</h4>
              {Object.entries(
                getPostDiff(post, {
                  title: watch("title"),
                  category: watch("category"),
                  postType: watch("postType"),
                  tags,
                  content: post.content, // you can also live-diff with editor.save()
                  image_links: imageFile || post.image_links,
                })
              ).map(([key, diff]) => (
                <div key={key} className="mb-2">
                  <strong>{key}:</strong>
                  <div className="text-red-500 line-through">
                    {String((diff as any).old)}
                  </div>
                  <div className="text-green-500">
                    {String((diff as any).new)}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Image Upload Section */}
          <div className="flex flex-col gap-4 items-center mb-4">
            {!imageFile && (
              <label className="cursor-pointer text-blue-500 underline">
                <input
                  type="file"
                  {...register("image")}
                  onChange={handleImage}
                  className="hidden"
                />
                Upload Image
              </label>
            )}
            {imageFile && (
              <figure className="relative w-full h-[300px] pt-2">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="absolute -top-2 -right-4 text-red-500 "
                  onClick={() => {
                    setImageFile(null);
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
                  className="w-full h-full object-cover rounded-md"
                />
              </figure>
            )}
          </div>

          {/* Category Section */}
          <div>
            <label htmlFor="category" className="font-semibold dark:text-white">
              Select Category
            </label>
          </div>
          <select
            id="category"
            {...register("category")}
            className="w-full md:w-1/2 mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700"
          >
            <option key="General" value="General">
              General
            </option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Title Input */}
          <TextareaAutosize
            id="title"
            {...register("title", { required: true })}
            className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-blue-600 mt-6 text-[32px] md:text-[40px] font-extrabold leading-snug resize-none pb-3 dark:bg-[#1e1e1e] dark:text-white"
            placeholder="Title"
            maxRows={3}
          />

          {/* Content Editor */}
          {/* <div id="editor" className="min-h-[300px] dark:text-light"></div> */}
          <div
            id="editor"
            className="
              min-h-[300px]
              w-full
              p-4
              mt-6
              rounded-lg
              border
              border-gray-300
              bg-white
              text-black
              shadow-sm
              focus-within:ring-2
              focus-within:ring-blue-500
              dark:bg-[#1e1e1e]
              dark:border-gray-700
              dark:text-white
              dark:focus-within:ring-blue-400
              prose
              prose-lg
              max-w-none
            "
          ></div>
          {/* <div
            id="editor"
            className="min-h-[300px] mt-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200"
          ></div> */}

          {/* Tags Section */}
          <div className="mt-4">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInput}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700"
              placeholder="Enter tags and press Enter"
            />
            <Button
              onPress={handleAddTag}
              className="mt-2"
              isDisabled={!tagInput}
            >
              Add Tag
            </Button>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500 text-white rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-white"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Editor;

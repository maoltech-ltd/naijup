"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@nextui-org/react";
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type EditorJS from "@editorjs/editorjs";
import { BackIcon } from "../icon";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { createPost, updatePost } from "@/src/redux/slice/postsSlice";
import { createImage } from "@/src/redux/slice/ImageSlice";
import { categories } from "@/src/utils/props";
import { UserState } from "@/src/redux/slice/userSlice";
import { Post } from "@/src/redux/slice/postSlice";
import ErrorModal from "../Modal/ErrorModal";
import SuccessModal from "../Modal/SuccessModal";


const Editor = ({ post, user }: { post: Post | null; user: UserState }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<any>({ defaultValues: { title: post?.title, category: post?.category } });

  const postType = watch("postType");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [postKind, setPostKind] = useState<"article" | "analysis">(
    post?.post_type === "analysis" ? "analysis" : "article"
  );
  const [analysisRating, setAnalysisRating] = useState(post?.analysis_meta?.rating || "");
  const [analysisTargetPrice, setAnalysisTargetPrice] = useState(
    post?.analysis_meta?.target_price != null ? String(post.analysis_meta.target_price) : ""
  );
  const [analysisTickers, setAnalysisTickers] = useState<string[]>(
    post?.analysis_meta?.tickers || []
  );
  const [tickerInput, setTickerInput] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const ref = useRef<EditorJS | undefined>(undefined);

  const imagePreviewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
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
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

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
        try {
          const uploadedImageUrl = await dispatch(
            createImage(imageFile)
          ).unwrap();
          imageUrl = uploadedImageUrl.url;
        } catch (error: any) {
          setErrorMessage(error.message || "Image upload failed");
          setErrorModalOpen(true);
          return;
        }
        
      }

      const postData = {
        title: data.title,
        content: blocks?.blocks,
        image_links: imageUrl,
        type: data.postType,
        category: data.category,
        author: user.userId,
        tags: tags,
        post_type: postKind,
        analysis_meta:
          postKind === "analysis"
            ? {
                rating: analysisRating || undefined,
                target_price: analysisTargetPrice ? Number(analysisTargetPrice) : undefined,
                tickers: analysisTickers,
              }
            : {},
      };
      let result;
      if (post) {
        result = await dispatch(updatePost({ id: post.id, changes: postData, token: user.token }));
      } else {
        result = await dispatch(createPost({ post: postData, token: user.token }));
      }
      if (result.meta.requestStatus === "rejected" && result.payload?.code === 401) {
        setErrorMessage("Your session has expired. Please sign in again.");
        setErrorModalOpen(true);
  
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
        return;
      }
  
      setSuccessMessage(post ? "Post updated successfully." : "Post created successfully.");
      setSuccessModalOpen(true);
      reset();
  
      if (result && result.payload?.slug) {
        router.push(`/blog/${result.payload.slug}`);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "Something went wrong.");
      setErrorModalOpen(true);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
  
    if (file && file.size > 100 * 1024) { // 100KB in bytes
      setErrorMessage("File size must not exceed 100KB");
      setErrorModalOpen(true);
      return;
    }
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

  const handleAddTicker = () => {
    const ticker = tickerInput.trim().toUpperCase();
    if (ticker && !analysisTickers.includes(ticker)) {
      setAnalysisTickers([...analysisTickers, ticker]);
    }
    setTickerInput("");
  };

  const handleRemoveTicker = (ticker: string) => {
    setAnalysisTickers(analysisTickers.filter((t) => t !== ticker));
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
        data: post ? { blocks: post.content } : { blocks: [] },
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
                  } catch (error: any) {
                    const errorMessage = error.message || 
                                    error.payload?.message || 
                                    error.error || 
                                    "Image upload failed.";
                    setErrorMessage(errorMessage);
                    setErrorModalOpen(true);
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
        ref.current?.destroy();
        ref.current = undefined;
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
          {post && (
            <div className="my-4 p-4 border rounded-md bg-gray-50 dark:bg-dark">
              <h4 className="font-bold mb-2 text-lg">Changes Preview</h4>
              {Object.entries(
                getPostDiff(post, {
                  title: watch("title"),
                  category: watch("category"),
                  postType: watch("postType"),
                  tags,
                  content: post.content,
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
                  src={imagePreviewUrl}
                  width={100}
                  height={100}
                  alt="post image"
                  className="w-full h-full object-cover rounded-md"
                />
              </figure>
            )}
          </div>

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
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {capitalize(category.name)}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <label className="font-semibold dark:text-white">Post Type</label>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setPostKind("article")}
                className={`rounded-md px-4 py-2 text-sm font-medium border ${
                  postKind === "article"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-black border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700"
                }`}
              >
                Article
              </button>
              <button
                type="button"
                onClick={() => setPostKind("analysis")}
                className={`rounded-md px-4 py-2 text-sm font-medium border ${
                  postKind === "analysis"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-black border-gray-300 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700"
                }`}
              >
                Investment Analysis
              </button>
            </div>
          </div>

          {postKind === "analysis" && (
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-md border border-gray-300 p-4 dark:border-gray-700 sm:grid-cols-2">
              <div>
                <label htmlFor="analysisRating" className="font-semibold dark:text-white">
                  Rating
                </label>
                <select
                  id="analysisRating"
                  value={analysisRating}
                  onChange={(e) => setAnalysisRating(e.target.value)}
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700"
                >
                  <option value="">Select rating</option>
                  <option value="buy">Buy</option>
                  <option value="accumulate">Accumulate</option>
                  <option value="hold">Hold</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div>
                <label htmlFor="analysisTargetPrice" className="font-semibold dark:text-white">
                  Target Price
                </label>
                <input
                  id="analysisTargetPrice"
                  type="number"
                  step="0.01"
                  value={analysisTargetPrice}
                  onChange={(e) => setAnalysisTargetPrice(e.target.value)}
                  placeholder="e.g. 320.00"
                  className="w-full mt-2 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="tickerInput" className="font-semibold dark:text-white">
                  Linked Tickers
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="tickerInput"
                    type="text"
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTicker();
                      }
                    }}
                    placeholder="e.g. DANGCEM"
                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700"
                  />
                  <Button type="button" onPress={handleAddTicker}>
                    Add
                  </Button>
                </div>
                {!!analysisTickers.length && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysisTickers.map((ticker) => (
                      <span
                        key={ticker}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      >
                        {ticker}
                        <button
                          type="button"
                          onClick={() => handleRemoveTicker(ticker)}
                          className="ml-1 text-blue-500 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <TextareaAutosize
            id="title"
            {...register("title", { required: true })}
            className="w-full border-0 border-b-2 border-gray-200 focus:outline-none focus:border-blue-600 mt-6 text-[32px] md:text-[40px] font-extrabold leading-snug resize-none pb-3 dark:bg-[#1e1e1e] dark:text-white"
            placeholder="Title"
            maxRows={3}
          />

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
              dark:prose-invert
              prose-lg
              max-w-none
            "
          ></div>
          <div className="mt-4">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInput}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700"
              placeholder="Enter tags and press Enter"
            />
            <Button
              type="button"
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
                    type="button"
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
      <ErrorModal isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} message={errorMessage} />
      <SuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} message={successMessage} />
    </form>
  );
};

export default Editor;

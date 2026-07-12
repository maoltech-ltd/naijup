"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type EditorJS from "@editorjs/editorjs";
import { Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { createImage } from "@/src/redux/slice/ImageSlice";
import api from "@/src/api";
import ErrorModal from "../Modal/ErrorModal";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "stocks", label: "Stocks" },
  { value: "crypto", label: "Crypto" },
  { value: "economy", label: "Economy" },
  { value: "startups", label: "Startups" },
];

export default function ForumTopicComposer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token } = useSelector((state: RootState) => state.user);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<EditorJS | undefined>(undefined);

  const initEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Quote = (await import("@editorjs/quote")).default;
    const Code = (await import("@editorjs/code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "forum-editor",
        placeholder: "Share your analysis, question, or discussion topic...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: { placeholder: "Enter a header", levels: [2, 3, 4], defaultLevel: 2 },
          },
          list: List,
          linkTool: LinkTool,
          inlineCode: InlineCode,
          quote: Quote,
          code: Code,
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile: async (file: File) => {
                  try {
                    const uploaded = await dispatch(createImage(file)).unwrap();
                    return { success: 1, file: { url: uploaded.url } };
                  } catch {
                    return { success: 0 };
                  }
                },
              },
            },
          },
        },
      });
      ref.current = editor;
    }
  }, [dispatch]);

  useEffect(() => {
    initEditor();
    return () => {
      ref.current?.destroy?.();
      ref.current = undefined;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please add a title for your topic.");
      return;
    }
    setSubmitting(true);
    try {
      const blocks = await ref.current?.save();
      const response = await api.post(
        "v1/forum/topics/",
        { title, category, content: blocks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push(`/forum/${response.data.slug}`);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Unable to create topic. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <ErrorModal isOpen={!!error} onClose={() => setError("")} message={error} />
      <h1 className="text-2xl font-bold text-dark dark:text-light">Start a Discussion</h1>

      <label htmlFor="forum-category" className="mt-6 block font-semibold dark:text-white">
        Category
      </label>
      <select
        id="forum-category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mt-2 w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1e1e1e] dark:text-white dark:border-gray-700 md:w-1/2"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Topic title"
        className="mt-6 w-full border-0 border-b-2 border-gray-200 pb-3 text-2xl font-bold focus:border-blue-600 focus:outline-none dark:bg-transparent dark:text-white"
      />

      <div
        id="forum-editor"
        className="prose dark:prose-invert mt-6 min-h-[240px] w-full max-w-none rounded-lg border border-gray-300 bg-white p-4 text-black shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-white dark:focus-within:ring-blue-400"
      />

      <div className="mt-6 flex justify-end">
        <Button color="primary" radius="sm" isLoading={submitting} onPress={handleSubmit}>
          {submitting ? "Posting..." : "Post Topic"}
        </Button>
      </div>
    </div>
  );
}

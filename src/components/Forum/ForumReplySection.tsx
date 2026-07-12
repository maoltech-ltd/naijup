"use client";
import { useState } from "react";
import { useSelector } from "react-redux";
import { MessageCircle, Send } from "lucide-react";
import { RootState } from "@/src/redux/store";
import api from "@/src/api";
import formatDate from "@/src/utils/dateFormatter";
import ErrorModal from "../Modal/ErrorModal";
import type { ForumReply } from "@/src/app/forum/[slug]/page";

interface Props {
  topicSlug: string;
  topicAuthorId: number;
  isLocked: boolean;
  initialReplies: ForumReply[];
}

export default function ForumReplySection({ topicSlug, isLocked, initialReplies }: Props) {
  const { userId, token } = useSelector((state: RootState) => state.user);
  const [replies, setReplies] = useState<ForumReply[]>(initialReplies);
  const [newReply, setNewReply] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;
    if (!userId || !token) {
      setError("Please sign in to reply.");
      return;
    }

    setPosting(true);
    try {
      const response = await api.post(
        `v1/forum/topics/${topicSlug}/replies/`,
        { content: newReply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplies((current) => [...current, response.data]);
      setNewReply("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Unable to post your reply. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="mt-14 border-t border-dark/10 pt-8 dark:border-light/10">
      <ErrorModal isOpen={!!error} onClose={() => setError("")} message={error} />

      <h2 className="text-2xl font-bold text-dark dark:text-light">
        Replies ({replies.length})
      </h2>

      {isLocked ? (
        <div className="mt-6 rounded-md border border-dark/10 bg-dark/[0.03] p-5 text-center text-sm text-gray dark:border-light/10 dark:bg-light/[0.04] dark:text-light/60">
          This topic is locked and no longer accepting replies.
        </div>
      ) : userId ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Add to the discussion..."
            className="min-h-28 w-full rounded-md border border-dark/15 bg-transparent p-4 text-dark outline-none transition focus:border-accent dark:border-light/15 dark:text-light dark:focus:border-accentDark"
            rows={4}
          />
          <button
            type="submit"
            disabled={posting}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-dark px-5 py-2.5 text-sm font-semibold text-light transition hover:bg-dark/85 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-light dark:text-dark dark:hover:bg-light/85"
          >
            <Send size={16} />
            {posting ? "Posting..." : "Post Reply"}
          </button>
        </form>
      ) : (
        <div className="mt-6 rounded-md border border-dark/10 bg-dark/[0.03] p-5 text-center dark:border-light/10 dark:bg-light/[0.04]">
          <p className="text-sm text-gray dark:text-light/60">Sign in to join the discussion.</p>
          <button
            onClick={() => {
              window.location.href = "/signin";
            }}
            className="mt-3 rounded-md bg-dark px-5 py-2 text-sm font-semibold text-light transition hover:bg-dark/85 dark:bg-light dark:text-dark dark:hover:bg-light/85"
          >
            Sign In
          </button>
        </div>
      )}

      {!replies.length && (
        <div className="mt-6 flex items-center gap-2 rounded-md border border-dashed border-dark/15 p-5 text-sm text-gray dark:border-light/15 dark:text-light/60">
          <MessageCircle size={18} />
          No replies yet. Be the first to respond.
        </div>
      )}

      <div className="mt-6 space-y-5">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className="rounded-md border border-dark/10 p-5 text-dark dark:border-light/10 dark:text-light"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold">{reply.author_username ?? "Anonymous"}</span>
              <span className="text-sm text-gray dark:text-light/50">
                {formatDate(reply.created_at)}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-dark/80 dark:text-light/75">
              {reply.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

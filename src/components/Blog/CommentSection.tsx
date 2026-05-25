"use client";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import ErrorModal from "../Modal/ErrorModal";
import formatDate from "@/src/utils/dateFormatter";
import api from "@/src/api";

interface Props {
  postId: number;
  initialLikesCount?: number;
  initialCommentsCount?: number;
}

type Comment = {
  id: number;
  post: number;
  author: string | number;
  author_username: string;
  content: string;
  publish_date: string;
};

type LikeState = {
  liked: boolean;
  like_id: number | null;
  likes_count: number;
};

const authHeaders = (token?: string) =>
  token ? { Authorization: `Bearer ${token}` } : undefined;

const isNotFound = (error: unknown) =>
  (error as { response?: { status?: number } })?.response?.status === 404;

const normalizeComments = (data: unknown): Comment[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray((data as { results?: unknown })?.results)) {
    return (data as { results: Comment[] }).results;
  }
  return [];
};

export default function CommentSection({
  postId,
  initialLikesCount = 0,
  initialCommentsCount = 0,
}: Props) {
  const { userId, token } = useSelector((state: RootState) => state.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [posting, setPosting] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [likeState, setLikeState] = useState<LikeState>({
    liked: false,
    like_id: null,
    likes_count: initialLikesCount,
  });

  useEffect(() => {
    let mounted = true;

    async function loadEngagement() {
      setStatus("loading");
      try {
        const commentsRes = await api.get(`v1/blog/${postId}/comments/`);

        if (!mounted) return;
        setComments(normalizeComments(commentsRes.data));
        setStatus("idle");
      } catch (error) {
        if (!mounted) return;

        if (isNotFound(error)) {
          setComments([]);
          setStatus("idle");
          return;
        }

        setStatus("failed");
        setError("Unable to load comments right now.");
      }
    }

    async function loadLikes() {
      try {
        const likesRes = await api.get(`v1/blog/${postId}/likes/`, {
          headers: authHeaders(token),
        });

        if (!mounted) return;
        setLikeState({
          liked: Boolean(likesRes.data?.liked),
          like_id: likesRes.data?.like_id ?? null,
          likes_count: Number(likesRes.data?.likes_count ?? initialLikesCount),
        });
      } catch {
        if (!mounted) return;
        setLikeState((current) => ({
          ...current,
          likes_count: initialLikesCount,
        }));
      }
    }

    loadEngagement();
    loadLikes();

    return () => {
      mounted = false;
    };
  }, [initialLikesCount, postId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!userId || !token) {
      setError("Please sign in to post a comment.");
      return;
    }

    setPosting(true);
    try {
      const response = await api.post(
        `v1/blog/${postId}/comments/`,
        { content: newComment },
        { headers: authHeaders(token) }
      );
      setComments((current) => [response.data, ...current]);
      setNewComment("");
    } catch {
      setError("Unable to post your comment. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!token) {
      setError("Please sign in to delete your comment.");
      return;
    }

    try {
      await api.delete(`v1/blog/${postId}/comments/${commentId}/`, {
        headers: authHeaders(token),
      });
      setComments((current) => current.filter((comment) => comment.id !== commentId));
    } catch {
      setError("Unable to delete this comment.");
    }
  };

  const handleLike = async () => {
    if (!userId || !token) {
      setError("Please sign in to like this post.");
      return;
    }

    setLikePending(true);
    try {
      const response = await api.post(
        `v1/blog/${postId}/likes/`,
        {},
        { headers: authHeaders(token) }
      );
      setLikeState({
        liked: Boolean(response.data?.liked),
        like_id: response.data?.like_id ?? null,
        likes_count: Number(response.data?.likes_count ?? 0),
      });
    } catch {
      setError("Unable to update like. Please try again.");
    } finally {
      setLikePending(false);
    }
  };

  return (
    <section className="mt-14 px-5 md:px-10">
      <ErrorModal isOpen={!!error} onClose={() => setError("")} message={error} />

      <div className="mx-auto max-w-5xl border-t border-dark/10 dark:border-light/10 pt-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
              Conversation
            </p>
            <h2 className="mt-1 text-2xl font-bold text-dark dark:text-light">
              Comments ({status === "loading" ? initialCommentsCount : comments.length})
            </h2>
          </div>

          <button
            type="button"
            onClick={handleLike}
            disabled={likePending}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              likeState.liked
                ? "border-accent bg-accent text-light dark:border-accentDark dark:bg-accentDark dark:text-dark"
                : "border-dark/15 text-dark hover:border-accent hover:text-accent dark:border-light/15 dark:text-light dark:hover:border-accentDark dark:hover:text-accentDark"
            }`}
            aria-pressed={likeState.liked}
          >
            <Heart size={18} fill={likeState.liked ? "currentColor" : "none"} />
            {likeState.likes_count}
          </button>
        </div>

        {userId ? (
          <form onSubmit={handleSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a thoughtful comment..."
              className="min-h-28 w-full rounded-md border border-dark/15 bg-transparent p-4 text-dark outline-none transition focus:border-accent dark:border-light/15 dark:text-light dark:focus:border-accentDark"
              rows={4}
            />
            <button
              type="submit"
              disabled={posting}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-dark px-5 py-2.5 text-sm font-semibold text-light transition hover:bg-dark/85 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-light dark:text-dark dark:hover:bg-light/85"
            >
              <Send size={16} />
              {posting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        ) : (
          <div className="mb-8 rounded-md border border-dark/10 bg-dark/[0.03] p-5 text-center dark:border-light/10 dark:bg-light/[0.04]">
            <p className="text-sm text-gray dark:text-light/60">
              Sign in to join the conversation or like this post.
            </p>
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

        {status === "loading" && <p className="text-sm text-gray">Loading comments...</p>}
        {status !== "loading" && comments.length === 0 && (
          <div className="flex items-center gap-2 rounded-md border border-dashed border-dark/15 p-5 text-sm text-gray dark:border-light/15 dark:text-light/60">
            <MessageCircle size={18} />
            No comments yet. Be the first.
          </div>
        )}

        <div className="space-y-5">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-md border border-dark/10 p-5 text-dark dark:border-light/10 dark:text-light"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">
                  {comment.author_username ?? "Anonymous"}
                </span>
                <span className="text-sm text-gray dark:text-light/50">
                  {formatDate(comment.publish_date)}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-dark/80 dark:text-light/75">
                {comment.content}
              </p>
              {String(comment.author) === String(userId) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

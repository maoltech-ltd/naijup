"use client";
import { useEffect, useState } from "react";
import { fetchComments, addComment, deleteComment } from "@/src/redux/slice/commentSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { RootState } from "@/src/redux/store";
import ErrorModal from "../Modal/ErrorModal";

interface Props {
  postId: number;
}

export default function CommentSection({ postId }: Props) {
  const dispatch = useAppDispatch();
  const { comments, status } = useSelector((state: RootState) => state.comment);
  const { userId, userName, token } = useSelector((state: RootState) => state.user);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [dispatch, postId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!userId) {
      <ErrorModal isOpen={true} onClose={() =>false} message="Please sign in to post a comment" />
      return;
    }
    dispatch(addComment({ postId, content: newComment, token}));
    setNewComment("");
  };

  const handleDelete = (commentId: number) => {
    dispatch(deleteComment({ postId, commentId }));
  };

  return (
    <section className="mt-10 px-5 md:px-10">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {userId ? (
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          rows={3}
        />
        <button
          type="submit"
          className="mt-3 bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
        >
          Post Comment
        </button>
      </form>
      ):(
        <div className="mb-6 p-4 border border-gray-300 rounded-lg text-center">
          <p className="text-gray-600 mb-2">Please sign in to post a comment</p>
          <button
            onClick={() => window.location.href = '/signin'}
            className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Sign In
          </button>
        </div>
      )}
      {/* Comments */}
      {status === "loading" && <p>Loading comments...</p>}
      {comments.length === 0 && status === "succeeded" && (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      )}

      <div className="space-y-6">
        {comments.map((comment: any) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{comment.author_username ?? "Anonymous"}</span>
              <span className="text-sm text-gray-500">
                {new Date(comment.publish_date).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2">{comment.content}</p>
            <button
              onClick={() => handleDelete(comment.id)}
              className="mt-2 text-sm text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import ForumTopicComposer from "@/src/components/Forum/ForumTopicComposer";

export default function NewForumTopicPage() {
  return (
    <ProtectedRoute>
      {() => <ForumTopicComposer />}
    </ProtectedRoute>
  );
}

"use client";
import Editor from '@/src/components/Post/Editor';
import ProtectedRoute from '@/src/components/ProtectedRoute';
import React from 'react';

const CreatePost = () => {
  return (
    <ProtectedRoute>
      {({ user }: any) => (
        <div className="flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8">
          <Editor post={null} user={user} />
        </div>
      )}
    </ProtectedRoute>
  );
};

export default CreatePost;

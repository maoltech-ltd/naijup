"use client";
import Editor from '@/src/components/Post/Editor'
import ProtectedRoute from '@/src/components/ProtectedRoute'
import React from 'react'

const createPost = () => {
  return (
    <ProtectedRoute>

      {({ user }: any) => (
        <div>
          <Editor post={null} user={user} />
        </div>
      )}

    </ProtectedRoute>
  )
}

export default createPost

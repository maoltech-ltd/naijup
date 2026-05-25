import { blogDetailsProp } from '@/src/utils/props'
import Link from 'next/link'
import React from 'react'

const BlogDetails: React.FC<blogDetailsProp> = ({blog, slug}) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }).format(new Date(blog.publication_date));
  const primaryTag = blog.tags?.[0] || blog.category;

  return (
    <div className="mx-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-y border-dark/10 px-2 py-3 text-sm font-medium text-dark/70 dark:border-light/10 dark:text-light/70 md:mx-10 md:px-10">
      <time className="m-3">
        {formattedDate}
      </time>
      <Link href={`/categories/${blog.category}`} className="m-3">
        #{primaryTag}
      </Link>
    </div>
  )
}

export default BlogDetails

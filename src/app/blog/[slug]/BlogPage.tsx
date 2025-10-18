"use client";
import Image from "next/image";
import { Suspense, lazy  } from "react";
import Category from "@/src/components/Elements/Category";
import BlogDetails from "@/src/components/Blog/BlogDetails";
import BlogContent from "@/src/components/Blog/BlogContent";
import ShareButtons from "@/src/components/Elements/ShareButtons";
import EditPostButton from "@/src/components/Post/EditPostButton";
import CommentSection from "@/src/components/Blog/CommentSection";

const AuthorSection = lazy(() => import("@/src/components/User/AuthorSection"));

export interface Blog {
  id: string;
  title: string;
  category: string;
  content: any;
  image_links: string;
  author: string;
  publication_date: string;
  updatedAt?: string;
  slug: string;
  tags: string[];
}
export default function BlogPage({  blog }: {  blog: Blog  }) {

  if (!blog) {
    return <div>No blog found</div>;
  }

  const imageSrc = blog.image_links || '/default-image.jpg';
  console.log({blogpost: blog});
  console.log({blogimage: imageSrc});
  console.log({blogslug: blog.slug});
  return (
    <>
      <article>
        <div className="mb-8 text-center relative w-full h-[70vh] bg-dark">
          <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Category
              name={blog.category}
              link={`/categories/${blog.category}`}
              className="px-6 text-sm py-2"
            />
            <h1 className="inline-block mt-6 font-semibold capitalize text-light text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6">
              {blog.title}
            </h1>
          </div>
          <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-dark/60 dark:bg-dark/40" />
          <Image
            src={imageSrc}
            alt={blog.title}
            width={100}
            height={100}
            className="aspect-square w-full h-full object-cover object-center"
            priority
            sizes="100vw"
            unoptimized
          />
        </div>
        <BlogDetails blog={blog} slug={blog.slug} />
        <div className="px-5 md:px-10">
          <ShareButtons
            url={`https://naijup.ng/blog/${blog.slug}`} 
            title={blog.title}
          />
        </div>

        <div className="grid grid-cols-12  gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 md:px-10">
          <div className="col-span-12  lg:col-span-3">
            <details
              className="border-[1px] border-solid border-dark dark:border-light text-dark dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto"
              open
            ></details>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <BlogContent content={blog.content} />
          </div>
          {/* <RenderMdx blog={blog} /> */}
        </div>
        <CommentSection postId={Number(blog.id)} />
        {/* Edit button is client-only, doesn’t delay render */}
        <EditPostButton slug={blog.slug} blog={blog} />
        <div className="px-5 md:px-10 mt-10">
            <Suspense fallback={<div>Loading author...</div>}>
              <AuthorSection authorId={blog.author} />
            </Suspense>
        </div>
      </article>
    </>
  );
  // }
}

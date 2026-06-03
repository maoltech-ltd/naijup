import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import Category from "@/src/components/Elements/Category";
import BlogDetails from "@/src/components/Blog/BlogDetails";
import BlogContent from "@/src/components/Blog/BlogContent";
import ShareButtons from "@/src/components/Elements/ShareButtons";
import EditPostButton from "@/src/components/Post/EditPostButton";
import CommentSection from "@/src/components/Blog/CommentSection";
import RelatedPosts from "@/src/components/Blog/RelatedPosts";
import AuthorSection from "@/src/components/User/AuthorSection";
import MarketHighlightTicker from "@/src/components/markets/MarketHighlightTicker";

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
  likes_count?: number;
  comments_count?: number;
  views_count?: number;
}
export default function BlogPage({  blog, relatedPosts = [] }: {  blog: Blog; relatedPosts?: any[]  }) {

  if (!blog) {
    return <div>No blog found</div>;
  }

  const imageSrc = blog.image_links || '/default-image.jpg';
  
  return (
    <>
      <article className="pb-16">
        <div className="relative mb-8 grid min-h-[72vh] w-full bg-dark text-light lg:grid-cols-[0.95fr_1.05fr]">
          <div className="order-2 flex flex-col justify-end px-5 py-10 sm:px-10 md:px-16 lg:order-1">
            <div className="max-w-3xl">
              <Category
                name={blog.category}
                link={`/categories/${blog.category}`}
                className="px-5 py-2 text-xs"
              />
              <h1 className="mt-6 max-w-4xl text-3xl font-bold capitalize !leading-tight md:text-5xl">
                {blog.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-light/70">
                <span>{blog.views_count ?? 0} reads</span>
                <span>{blog.likes_count ?? 0} likes</span>
                <span>{blog.comments_count ?? 0} comments</span>
              </div>
            </div>
          </div>
          <div className="relative order-1 min-h-[42vh] lg:order-2 lg:min-h-[72vh]">
            <Image
              src={imageSrc}
              alt={blog.title}
              fill
              quality={55}
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
            <div className="absolute inset-0 bg-dark/15" />
          </div>
        </div>
        <MarketHighlightTicker className="mb-8" />
        <BlogDetails blog={blog} slug={blog.slug} />
        <div className="px-5 md:px-10">
          <ShareButtons
            url={`https://naijup.ng/blog/${blog.slug}`} 
            title={blog.title}
          />
        </div>

        <div className="grid grid-cols-12 gap-y-8 px-5 md:px-10 lg:gap-10 sxl:gap-16 mt-8">
          <div className="col-span-12 lg:col-span-3">
            <aside className="sticky top-6 border-y border-dark/10 py-5 text-dark dark:border-light/10 dark:text-light">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
                Topics
              </p>
              <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
                {blog.tags?.slice(0, 6).map((tag) => (
                  <Link
                    key={tag}
                    href={`/categories/${blog.category}`}
                    className="text-sm font-medium text-dark/75 hover:text-accent dark:text-light/70 dark:hover:text-accentDark"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </aside>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <BlogContent content={blog.content} />
          </div>
          {/* <RenderMdx blog={blog} /> */}
        </div>
        <RelatedPosts posts={relatedPosts} />
        <CommentSection
          postId={Number(blog.id)}
          initialLikesCount={blog.likes_count}
          initialCommentsCount={blog.comments_count}
        />
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

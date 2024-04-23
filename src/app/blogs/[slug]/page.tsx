import { sortBlogs } from "@/src/utils";
import Category from "../../components/Elements/Category";
import { blogHome } from "@/src/content";
import Image from "next/image";
import BlogDetails from "../../components/Blog/BlogDetails";
import RenderMdx from "../../components/Blog/RenderMdx";
import BlogContent from "../../components/Blog/BlogContent";

export async function generateStaticParams() {

     return blogHome.map((blog:any) => {slug: blog.id.toString()})
 }
export default function BlogPage({ params }: { params: { slug: string } }) {
    const sortedBlogs = sortBlogs(blogHome)
    const blog : any= sortedBlogs.find((blog: any) => blog.id.toString() === params.slug)
    return (
        <>
    <script/>
       <article>
      <div className="mb-8 text-center relative w-full h-[70vh] bg-dark">
        <div className="w-full z-10 flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Category
            name={blog.category}
            link={`/categories/${blog.category}`}
            className="px-6 text-sm py-2"
          />
          <h1
            className="inline-block mt-6 font-semibold capitalize text-light text-2xl md:text-3xl lg:text-5xl !leading-normal relative w-5/6"
          >
            {blog.title}
          </h1>
        </div>
        <div className="absolute top-0 left-0 right-0 bottom-0 h-full bg-dark/60 dark:bg-dark/40" />
        <Image
          src={blog.image.link}
          alt={blog.title}
          width={blog.image.width}
          height={blog.image.height}
          className="aspect-square w-full h-full object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>
      <BlogDetails blog={blog} slug={params.slug} />

      <div className="grid grid-cols-12  gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 md:px-10">
        <div className="col-span-12  lg:col-span-3">
          <details
            className="border-[1px] border-solid border-dark dark:border-light text-dark dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto"
            open
          >
          </details>
        </div>
        <div className="col-span-12 lg:col-span-9">
          <BlogContent content={blog.content} />
        </div>
        {/* <RenderMdx blog={blog} /> */}
      </div>
    </article>
    </>
    )
  }
import { Props } from "@/src/utils/props";
import { sortBlogs } from "@/src/utils";
import Link from "next/link";
import BlogLayoutThree from "../Blog/BlogLayoutThree";

const RecentPost: React.FC<Props> = (blogs: any) => {
  const sortedBlogs = sortBlogs(blogs);

  return (
    <section className="w-full px-5 pt-16 sm:px-10 md:px-24 md:pt-24 sxl:px-32">
    <div className="flex w-full items-end justify-between border-b border-dark/10 pb-4 dark:border-light/10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent dark:text-accentDark">
          Latest
        </p>
        <h2 className="mt-1 w-fit text-2xl font-bold capitalize text-dark dark:text-light md:text-4xl">
          Recent Posts
        </h2>
      </div>
      <Link
        href="/categories/all"
        className="inline-block text-sm font-semibold text-accent underline underline-offset-4 dark:text-accentDark md:text-base"
      >
        View all
      </Link>
    </div>

    <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {sortedBlogs.slice(4, 10).map((blog: any, index: any) => {
        return (
          <article key={index} className="col-span-1 row-span-1 relative">
            <BlogLayoutThree blog={blog} />
          </article>
        );
      })}
    </div>
  </section>
  )
}

export default RecentPost

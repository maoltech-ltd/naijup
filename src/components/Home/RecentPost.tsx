import { Props } from "@/src/utils/props";
import { sortBlogs } from "@/src/utils";
import BlogLayoutThree from "../Blog/BlogLayoutThree";
import SectionHeader from "./SectionHeader";

const RecentPost: React.FC<Props> = (blogs: any) => {
  const recent = sortBlogs(blogs).slice(4, 10);
  if (!recent.length) return null;

  return (
    <section className="w-full px-5 pt-14 sm:px-10 md:px-24 md:pt-20 sxl:px-32">
      <SectionHeader eyebrow="Latest" title="Recent Posts" href="/categories/all" />

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {recent.map((blog: any) => (
          <article key={blog.id || blog.slug}>
            <BlogLayoutThree blog={blog} />
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentPost;

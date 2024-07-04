import { BlogProp } from "@/src/utils/props"
import Link from "next/link"
import Category from "../Elements/Category"
import Image from "next/image"

const BlogLayoutOne: React.FC<BlogProp> = (blog: any) => {
 
  return (
    <div className="group inline-block overflow-hidden rounded-xl">
      <div
        className="absolute top-0 left-0 bottom-0 right-0 h-full
            bg-gradient-to-b from-transparent from-0% to-dark/90 rounded-xl z-10
            "
      />
      <Image
        src={blog.blog.image_links[0]}
        alt={blog.blog.title}
        width={50}
        height={50}
        className="w-full h-full object-center object-cover rounded-xl group-hover:scale-105 transition-all ease duration-300"
        sizes="(max-width: 1180px) 100vw, 50vw"
      />

      <div className="w-full absolute bottom-0 p-4 xs:p-6 sm:p-10 z-20">
        <Category link={`/categories/${blog.blog.category}`} name={blog.blog.category}
        className="px-6 text-xs  sm:text-sm py-1 sm:py-2 !border "
        />
        <Link href={`http://localhost:300/blog/${blog.blog.title}`} className="mt-6">
          <h2 className="font-bold capitalize text-sm xs:text-base sm:text-xl md:text-2xl text-light mt-2 sm:mt-4">
            <span
              className="bg-gradient-to-r from-accent to-accent bg-[length:0px_6px] dark:from-accentDark/50 dark:to-accentDark/50
                group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 "
            >
              {blog.blog.title}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  )
}

export default BlogLayoutOne 
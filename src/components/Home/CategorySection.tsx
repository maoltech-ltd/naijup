"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/src/app/blog/[slug]/BlogPage";
import { sortBlogs } from "@/src/utils";

type Props = {
  category: string;
  blogs: Blog[];
};

const CategorySection: React.FC<Props> = ({ category, blogs }) => {
  if (!blogs || blogs.length === 0) return null;

  const sorted = sortBlogs({ blogs }).slice(0, 5);

  return (
    <section className="w-full mt-12 sm:mt-20 md:mt-28 px-5 sm:px-10 md:px-24 sxl:px-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-2xl md:text-3xl capitalize text-dark dark:text-light">
          {category}
        </h2>
        <Link
          href={`/categories/${category}`}
          className="text-accent dark:text-accentDark text-sm md:text-base hover:underline"
        >
          View all →
        </Link>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sorted.map((blog: any, index: any) => (
          <article
            key={index}
            className="rounded-2xl overflow-hidden bg-light dark:bg-dark shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full h-56">
              <Image
                src={blog.image_links}
                alt={blog.title}
                fill
                loading="lazy"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <Link href={`/blog/${blog.slug}`}>
                <h3 className="font-semibold text-lg md:text-xl text-dark dark:text-light line-clamp-2 hover:text-accent transition-colors">
                  {blog.title}
                </h3>
              </Link>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400 line-clamp-3">
                {blog.excerpt || blog.content?.slice(0, 100)}...
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

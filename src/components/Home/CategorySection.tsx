"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { useSelector } from "react-redux";
import LoadingSpinner from "@/src/components/loading/loadingSpinner";
import { sortBlogs } from "@/src/utils";
import { fetchBulkCategories } from "@/src/redux/slice/bulkCategorySlice";
// import { RootState } from "@/src/redux/store";
import { makeSelectBulkCategory } from "@/src/redux/hooks/bulkCategorySelectors";

type Props = {
  category: string;
};

const CategorySection: React.FC<Props> = ({ category }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);


   const selectCategoryData = useMemo(
    () => makeSelectBulkCategory(category),
    [category]
  );

  const { categories, status, error } = useSelector(selectCategoryData);

  // useEffect(() => {
  //   const element = ref.current;
  //   if (!element) return;
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       const entry = entries[0];
  //       if (entry.isIntersecting) {
  //         setVisible(true);
  //       }
  //     },
  //     { threshold: 0.3 }
  //   );
  //   if (element) observer.observe(element);
  //   return () => {
  //     if (element) observer.unobserve(element);
  //   };
  // }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);


  useEffect(() => {
    if (visible && !loaded) {
      dispatch(fetchBulkCategories(category))
        .unwrap()
        .then(() => setLoaded(true))
        .catch(() => setLoaded(true));
    }
  }, [visible, loaded, dispatch, category]);


  let sorted: any[] = [];
  if (status === "succeeded" && categories?.results) {
    sorted = sortBlogs({ blogs: categories.results });
  }

  return (
    <section
      ref={ref}
      className="w-full mt-12 sm:mt-20 md:mt-28 px-5 sm:px-10 md:px-24 sxl:px-32"
    >
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

      {/* Content */}
      {!visible ? (
        <div className="text-center text-gray-500">Scroll to load {category}...</div>
      ) : status === "loading" ? (
        <LoadingSpinner />
      ) : status === "failed" ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : sorted.length === 0 ? (
        <div className="text-center text-gray-500">No posts found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.slice(0, 3).map((blog: any, index: number) => (
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
                  sizes="(max-width: 640px) 100vw,
                          (max-width: 1024px) 50vw,
                          33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <Link href={`/blog/${blog.slug}`}>
                  <h3 className="font-semibold text-lg md:text-xl text-dark dark:text-light line-clamp-2 hover:text-accent transition-colors">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-sm mt-2 text-gray-600 dark:text-light line-clamp-3">
                  {Array.isArray(blog.content)
                    ? blog.content
                        .map((block: any) => block.data?.text || "")
                        .join(" ")        // join paragraphs
                        .replace(/<[^>]+>/g, "") // remove any HTML tags like <b>
                        .slice(0, 150) + "..."
                    : String(blog.content || "").slice(0, 150) + "..."}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategorySection;

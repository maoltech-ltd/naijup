"use client";
import React, { useEffect, useState } from "react";
import { sortBlogs } from "@/src/utils";
import Categories from "@/src/components/Blog/Categories";
import BlogLayoutThree from "@/src/components/Blog/BlogLayoutThree";
import { useAppDispatch } from "@/src/redux/hooks/dispatch";
import { fetchCategories } from "@/src/redux/slice/categorySlice";
import { useSelector } from "react-redux";
// import SuccessModal from "@/src/components/Modal/SuccessModal";
import ErrorModal from "@/src/components/Modal/ErrorModal";

const CategoryPage: React.FC<{ params: { slug: string } }> = ({ params }) => {
  const dispatch = useAppDispatch();

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

   useEffect(() => {
    dispatch(fetchCategories(params.slug));
   }, [dispatch, params.slug]);

   const { categories, status, error } = useSelector((state: any) => state.category);

  useEffect(() => {
    if (status === 'failed') {
      setErrorMessage(error);
      setIsErrorOpen(true);
    } else if (status === 'succeeded') {
      setSuccessMessage("Categories fetched successfully!");
      setIsSuccessOpen(true);
    }
  }, [status, error]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (status === 'succeeded') {
    const sortedBlogs = sortBlogs({blogs: categories.results});

    const allCategories: string[] = [];
    sortedBlogs.forEach((blog: any) => {
      if (!allCategories.includes(blog.category)) {
        allCategories.push(blog.category);
      }
    });

    return (
      <main className="mt-12 flex flex-col text-dark dark:text-light">
        <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
          <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl">#{params.slug}</h1>
          <span className="mt-2 inline-block">
            Discover more categories and expand your knowledge!
          </span>
        </div>
        <Categories categories={allCategories} currentSlug={params.slug} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32">
          {sortedBlogs.map((blog: any, index: number) => (
            <article key={index} className="col-span-1 row-span-1 relative">
              <BlogLayoutThree blog={blog} />
            </article>
          ))}
        </div>

        
        {/* <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} message={successMessage} /> */}
      </main>
    );
  }

  return null;
};

export default CategoryPage;

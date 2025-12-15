"use client";
import React, { useState } from "react";
import HomeCoverSection from "../components/Home/HomeCoverSection";
import FeaturedPost from "../components/Home/FeaturedPost";
import RecentPost from "../components/Home/RecentPost";
import HeadlineTicker from "../components/markets/HeadlineTicker";
import { categories, Props } from "../utils/props";
// import CategorySection from "../components/Home/CategorySection";
import ErrorModal from "../components/Modal/ErrorModal";
import dynamic from "next/dynamic";
import LoadingSpinner from "../components/loading/loadingSpinner";

type HomeClientProps = {
  blogs?: any;
  error?: string;
};

const CategorySection = dynamic(
  () => import("../components/Home/CategorySection"),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const HomeClient: React.FC<HomeClientProps> = ({blogs, error}) => {
  const [open, setOpen] = useState(!!error);
  if (error) {
    return (
      <ErrorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        message={error}
      />
    );
  }

  if (!blogs) {
    return <p className="text-gray-500">No posts found.</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center">
      <>
        <HomeCoverSection blogs={blogs} />
        <div>
          <HeadlineTicker />
        </div>
        <FeaturedPost blogs={blogs} />
        <RecentPost blogs={blogs} />
        {/* 🆕 Dynamic Category Sections */}
        {categories.map((cat) => {
          return (
            <CategorySection
              key={cat.name}
              category={cat.name}
            />
          );
        })} 
      </>
    </main>
  );
};

export default HomeClient;

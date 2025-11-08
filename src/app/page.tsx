"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks/dispatch";
import { fetchPosts } from "../redux/slice/postsSlice";
import HomeCoverSection from "../components/Home/HomeCoverSection";
import FeaturedPost from "../components/Home/FeaturedPost";
import RecentPost from "../components/Home/RecentPost";
import ErrorModal from "../components/Modal/ErrorModal";
import LoadingSpinner from "../components/loading/loadingSpinner";
import HeadlineTicker from "../components/markets/HeadlineTicker";
// import { categories } from "../utils/props";
// import CategorySection from "../components/Home/CategorySection";


const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  // const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any | null>(null);
  const [blogs, setBlogs] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchPosts())
      .unwrap()
      .then((result: any) => {
        // setIsSuccessOpen(true);
        setBlogs(result);
      })
      .catch((error: any) => {
        setIsErrorOpen(true);
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (errorMessage) {
    return <div>Error loading blog: {errorMessage.message}</div>;
  }

  if (!blogs) {
    return <div>No blog found</div>;
  }
  const results = blogs.results;
  return (
    <main className="flex flex-col items-center justify-center">
      <>
        <HomeCoverSection blogs={results} />
        <div>
          <HeadlineTicker />
        </div>
        <FeaturedPost blogs={results} />
        <RecentPost blogs={results} />
        {/* 🆕 Dynamic Category Sections */}
        {/* {categories.map((cat) => {
          const catPosts = results.filter(
            (post: any) => post.category?.toLowerCase() === cat.name.toLowerCase()
          );
          return (
            <CategorySection
              key={cat.name}
              category={cat.name}
              blogs={catPosts}
            />
          );
        })} */}
      </>
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        message={errorMessage}
      />
      {/* <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} message={successMessage} /> */}
    </main>
  );
};

export default Home;

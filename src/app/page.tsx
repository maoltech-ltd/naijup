// "use client";
// import HomeCoverSection from "../components/Home/HomeCoverSection";
// import FeaturedPost from "../components/Home/FeaturedPost";
// import RecentPost from "../components/Home/RecentPost";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useAppDispatch } from "../redux/hooks/dispatch";
// import { fetchPosts } from "../redux/slice/postSlice";
// //import dynamic from 'next/dynamic';
// export default function Home() {
  
//   // const HomeCoverSection = dynamic(() => import("../components/Home/HomeCoverSection"));
//   // const FeaturedPost = dynamic(() => import("../components/Home/FeaturedPost"));
//   // const RecentPost = dynamic(() => import("../components/Home/RecentPost"));
  
//   const dispatch = useAppDispatch();
  
//   useEffect(() => {
//     dispatch(fetchPosts());
//   }, []);

//   const post = useSelector((state: any) => state.post
//   ); 
//   const {posts, status, error} = post

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (status === 'failed') {
//     return <div>Error: {error}</div>;
//   }
//   if(status === 'succeeded'){
  
//   return (
//     <main className="flex flex-col items-center justify-center">
//       <HomeCoverSection blogs={posts.results[0]} />
//       <FeaturedPost blogs={posts.results} />
//       <RecentPost blogs={posts} />
//     </main>
//   );
// }

// }

"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks/dispatch";
import { fetchPosts } from "../redux/slice/postsSlice";
import HomeCoverSection from "../components/Home/HomeCoverSection";
import FeaturedPost from "../components/Home/FeaturedPost";
import RecentPost from "../components/Home/RecentPost";
import ErrorModal from "../components/Modal/ErrorModal";
import SuccessModal from "../components/Modal/SuccessModal";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const post = useSelector((state: any) => state.posts); 
  const { posts, status, error } = post;

  useEffect(() => {
    if (status === 'failed') {
      setErrorMessage(error);
      setIsErrorOpen(true);
    } else if (status === 'succeeded') {
      setSuccessMessage("Posts fetched successfully!");
      setIsSuccessOpen(true);
    }
  }, [status, error]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-center">
      {status === 'succeeded' && (
        <>
          <HomeCoverSection blogs={posts.results[0]} />
          <FeaturedPost blogs={posts.results} />
          <RecentPost blogs={posts} />
        </>
      )}
      <ErrorModal isOpen={isErrorOpen} onClose={() => setIsErrorOpen(false)} message={errorMessage} />
      <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} message={successMessage} />
    </main>
  );
};

export default Home;


"use client";
import HomeCoverSection from "../components/Home/HomeCoverSection";
import FeaturedPost from "../components/Home/FeaturedPost";
import RecentPost from "../components/Home/RecentPost";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../redux/hooks/dispatch";
import { fetchPosts } from "../redux/slice/postSlice";
export default function Home() {
  
  const dispatch = useAppDispatch();
      dispatch(fetchPosts());

  const post = useSelector((state: any) => state
  //|| { posts: [], status: 'idle', error: null }
  ); 

  console.log({post})
  const {posts, status, error} = post

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if(status === 'succeeded'){
    console.log({post})
  console.log({post: posts.result})
  console.log({count: posts.count})
  return (
    <main className="flex flex-col items-center justify-center">
      <HomeCoverSection blogs={posts.result[0]} />
      <FeaturedPost blogs={posts.result} />
      <RecentPost blogs={posts} />
    </main>
  );
}

}

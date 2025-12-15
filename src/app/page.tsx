import React from "react";
import HomeClient from "./HomeClient";


  async function fetchPosts() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}v1/blog/latest-posts/`, {
            next: { revalidate: 60 },
            });
            if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);

            const blogs = await res.json();

            return blogs;
        } catch (error) {
            console.error('Error fetching blog:', error);
            return null;
        }
 }

const Home = async() => {
    const blogs = await fetchPosts();
    if (!blogs || !blogs.results || blogs.results.length === 0 || blogs.error) {
        const errorMsg = 'No posts found.';
        console.error(errorMsg);
        return <HomeClient error={errorMsg} />;
    } 

    return <HomeClient blogs={blogs.results}  />;
  
};

export default Home;

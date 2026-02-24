// "use client";
// import React, { useEffect, useRef, useState, memo } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Category from "../Elements/Category";
// import { SwiperSlide, Swiper } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";

// type Props = {
//   blogs: any[];
// };

// const HomeCoverSection: React.FC<Props> = memo(({ blogs }) => {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted || !blogs?.length) return null;

//   const validBlogs = blogs.filter(blog => 
//     blog && blog.image_links && blog.title && blog.category
//   ).slice(0, 3); // Limit to 3 slides maximum

//   if (validBlogs.length === 0) return null;

//   return (
//     <div className="w-full inline-block">
//       {/* Preload first image */}
//       <link 
//         rel="preload" 
//         as="image"
//         href={validBlogs[0].image_links}
//         fetchPriority="high"
//       />
      
//       <Swiper
//         modules={[Navigation, Autoplay]}
//         navigation
//         autoplay={{ delay: 5000, disableOnInteraction: false }}
//         loop={validBlogs.length > 1}
//         slidesPerView={1}
//         className="rounded-3xl overflow-hidden"
//         lazyPreloadPrevNext={1}
//       >
//         {validBlogs.map((blog, index) => (
//           <SwiperSlide key={blog.slug}>
//             <article className="relative flex flex-col items-start justify-end mx-5 sm:mx-10 h-[50vh] sm:h-[70vh] rounded-3xl overflow-hidden">
//               {/* Optimized Image with proper sizing */}
//               <Image
//                 src={blog.image_links}
//                 alt={blog.title}
//                 fill
//                 priority={index === 0}
//                 loading={index === 0 ? "eager" : "lazy"}
//                 fetchPriority={index === 0 ? "high" : "auto"}
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
//                 quality={75} // Reduced from 85 for better performance
//                 className="object-cover object-center"
//                 placeholder="blur"
//                 blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Use a tiny base64 placeholder
//               />

//               <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark/80 z-10" />

//               <div className="relative w-3/4 p-4 sm:p-6 md:p-8 z-20 text-light">
//                 <Category
//                   link={`/categories/${blog.category}`}
//                   name={blog.category}
//                   className="text-xs sm:text-sm"
//                 />
//                 <Link href={`/blog/${blog.slug}`} className="mt-4 block">
//                   <h1 className="font-bold text-light text-2xl sm:text-3xl lg:text-4xl line-clamp-3">
//                     {blog.title}
//                   </h1>
//                 </Link>
//               </div>
//             </article>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// });

// HomeCoverSection.displayName = 'HomeCoverSection';
// export default HomeCoverSection;
import Image from "next/image";
import Link from "next/link";
import Category from "../Elements/Category";
import { Blog } from "@/src/app/blog/[slug]/BlogPage";

type Props = {
  blog: Blog;
};

export default function HomeCoverSection({ blog }: Props) {
  if (!blog?.image_links || !blog?.title || !blog?.category) return null;


  return (
    <section className="w-full px-5 sm:px-10">
      <article className="relative flex items-end h-[50vh] sm:h-[60vh] rounded-3xl overflow-hidden">

        {/* Optimized Hero Image */}
        <Image
          src={blog.image_links}
          alt={blog.title}
          fill
          priority
          sizes="100vw"
          quality={70}
          className="object-cover object-center"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 w-4/5 p-6 md:p-10 text-white">
          <Category
            link={`/categories/${blog.category}`}
            name={blog.category}
            className="text-sm"
          />

          <Link href={`/blog/${blog.slug}`} className="block mt-4">
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight">
              {blog.title}
            </h1>
          </Link>
        </div>
      </article>
    </section>
  );
}
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Category from "../Elements/Category";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Props = {
  blogs: any[];
};

const HomeCoverSection: React.FC<Props> = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  const validBlogs = blogs.filter(blog => 
    blog && blog.image_links && blog.title && blog.category
  );

  if (validBlogs.length === 0) {
    return null;
  }

  return (
    <div className="w-full inline-block">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop
        slidesPerView={1}
        className="rounded-3xl overflow-hidden"
      >
        {validBlogs.slice(0, 4).map((blog, index) => (
          <SwiperSlide key={index}>
            <article className="relative flex flex-col items-start justify-end mx-5 sm:mx-10 h-[60vh] sm:h-[85vh] rounded-3xl overflow-hidden">
              {/* Background Image */}
              <Image
                src={blog.image_links}
                alt={blog.title}
                fill
                priority
                className="object-cover object-center absolute inset-0 z-0"
                unoptimized
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark/90 z-10" />

              {/* Content */}
              <div className="relative w-3/4 p-6 sm:p-8 md:p-12 flex flex-col items-start justify-center z-20 text-light">
                <Category
                  link={`/categories/${blog.category}`}
                  name={blog.category}
                />
                <Link href={`/blog/${blog.slug}`} className="mt-6">
                  <h1 className="font-bold capitalize text-light text-4xl sm:text-xl md:text-3xl lg:text-4xl">
                    <span
                      className="bg-gradient-to-r from-accent to-accent dark:from-accentDark/50 
                      dark:to-accentDark/50 bg-[length:0px_6px]
                      hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500"
                    >
                      {blog.title}
                    </span>
                  </h1>
                </Link>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCoverSection;

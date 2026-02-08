import { Blog } from "../app/blog/[slug]/BlogPage";

export type Props = {
  blogs: Blog[];
};

export interface CategoryProps  {
  className?: string;
  name?: string;
  link: string
}

export type BlogProp ={
  blog: any;
}

export type blogDetailsProp = {
  blog: any,
  slug: string
}

export type CategoriesProp = {
  categories: string[],
  currentSlug: string
}

export type CategoryProp = {
  link: string,
  name: string,
  active: boolean,
  className?: string  
}

export type TPost = {
  id: string;
  title: string;
  image: string;
  content: any;
  path: string;
  // author: TUser;
  author: any;
  tags: string[];
  type: "PUBLISHED" | "DRAFT";
  // comments: TComment[];
  comments: any[];
  createdAt: Date;
  updatedAt: Date;
  // saved: TSavedPost[];
  saved: any[];
  _count: {
    comments: number;
  };
};

export const categories = [
  { name: "general", link: "/categories/general" },
  { name: "startup", link: "/categories/startup" },
  { name: "investment", link: "/categories/investment" },
  { name: "crypto", link: "/categories/crypto" },
  { name: "opportunity", link: "/categories/opportunity" },
  { name: "business", link: "/categories/business" },
  { name: "economy", link: "/categories/economy" },
  { name: "others", link: "/categories/others" }, 
];
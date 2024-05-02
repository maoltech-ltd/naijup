export type Props = {
  blogs: object[];
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
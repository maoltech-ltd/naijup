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
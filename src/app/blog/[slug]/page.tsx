import type { Metadata } from "next";
import { notFound } from "next/navigation";
import siteMetadata from "@/src/utils/sitemetadata";
import BlogPage from "./BlogPage";

export const revalidate = 60;

type BlogAuthor = {
  name?: string;
};

type BlogPost = {
  id?: string;
  title: string;
  category?: string;
  content?: any;
  image_links?: string;
  author?: BlogAuthor | string;
  publication_date?: string;
  updatedAt?: string;
  updated_at?: string;
  slug: string;
  tags?: string[];
};

const baseUrl = siteMetadata.siteUrl;
const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.naijup.ng/api/";

async function getBlog(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${apiBaseUrl}v1/blog/post/slug/${slug}/`, {
      next: { revalidate },
    });

    if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);

    const blog = await res.json();

    if (!blog?.title) return null;

    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function contentBlocks(content: any): any[] {
  if (Array.isArray(content)) return content;
  if (Array.isArray(content?.blocks)) return content.blocks;
  return [];
}

function firstParagraph(content: any) {
  const paragraph = contentBlocks(content).find(
    (block: any) => block.type === "paragraph" && block.data?.text
  )?.data?.text;

  return stripHtml(paragraph);
}

function truncateDescription(value: string) {
  if (value.length <= 160) return value;
  return `${value.slice(0, 157).trim()}...`;
}

function absoluteUrl(path?: string) {
  if (!path) return `${baseUrl}${siteMetadata.socialBanner}`;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function authorName(author?: BlogAuthor | string) {
  if (!author) return siteMetadata.author;
  if (typeof author === "string") return author;
  return author.name || siteMetadata.author;
}

function blogDescription(blog: BlogPost) {
  return truncateDescription(
    firstParagraph(blog.content) ||
      `Read ${blog.title} on NaijUp for Nigerian finance, markets, business, and economy insights.`
  );
}

function blogKeywords(blog: BlogPost) {
  if (blog.tags?.length) return blog.tags;
  return [blog.category, ...siteMetadata.keywords].filter(Boolean) as string[];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const blogUrl = `${baseUrl}/blog/${params.slug}`;
  const image = absoluteUrl(blog.image_links);
  const description = blogDescription(blog);
  const author = authorName(blog.author);

  return {
    title: blog.title,
    description,
    keywords: blogKeywords(blog),
    authors: [{ name: author }],
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: blog.title,
      description,
      url: blogUrl,
      siteName: siteMetadata.siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: "article",
      publishedTime: blog.publication_date,
      modifiedTime: blog.updatedAt || blog.updated_at || blog.publication_date,
      authors: [author],
      section: blog.category,
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [image],
      creator: "@official_naijup",
      site: "@official_naijup",
    },
  };
}

function BlogStructuredData({ blog, slug }: { blog: BlogPost; slug: string }) {
  const url = `${baseUrl}/blog/${slug}`;
  const image = absoluteUrl(blog.image_links);
  const author = authorName(blog.author);
  const description = blogDescription(blog);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: blog.title,
    image: [image],
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: siteMetadata.siteName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteMetadata.siteLogo),
      },
    },
    datePublished: blog.publication_date,
    dateModified: blog.updatedAt || blog.updated_at || blog.publication_date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: blog.category,
    keywords: blog.tags?.join(", "),
    description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function BlogSEOPage({ params }: { params: { slug: string } }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <BlogStructuredData blog={blog} slug={params.slug} />
      <BlogPage blog={blog as any} />
    </>
  );
}

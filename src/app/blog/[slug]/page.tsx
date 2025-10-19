import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPage from './BlogPage';
import api from '@/src/api';

// Server-side data fetching
// async function getBlog(slug: string) {
//   try {
//     const res = await api.get(`v1/blog/post/slug/${slug}/`);
//     return res.data;
//   } catch (error) {
//     console.error('Error fetching blog:', error);
//     return null;
//   }
// }

async function getBlog(slug: string, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await api.get(`v1/blog/post/slug/${slug}/`);
      if (res.data?.title) return res.data;
    } catch (error) {
      if (i === retries) {
        console.error('Error fetching blog:', error);
        return null;
      }
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

const firstParagraph = (content: any) =>{
  return content.find(
    (block: any) => block.type === "paragraph" && block.data?.text
  )?.data?.text;
}

// Generate SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  const blogUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.slug}`;
  const blogImage = blog.image_links || '/default-social-banner.png';
  const description = (firstParagraph(blog.content)?.substring(0, 160)) || `Read ${blog.title} on Naijup`;

  return {
    title: blog.title,
    description: description,
    keywords: blog.tags?.join(', ') || '',
    authors: [{ name: blog.author?.name || 'Naijup' }],
    openGraph: {
      title: blog.title,
      description: description,
      url: blogUrl,
      siteName: 'Naijup',
      images: [
        {
          url: blogImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      type: 'article',
      publishedTime: blog.publication_date,
      modifiedTime: blog.updatedAt,
      authors: [blog.author?.name || 'Naijup'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: description,
      images: [blogImage],
      creator: '@maoltech',
    },
    alternates: {
      canonical: blogUrl,
    },
  };
}

// JSON-LD structured data
function BlogStructuredData({ blog, slug }: { blog: any; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.image_links],
    "author": {
      "@type": "Person",
      "name": blog.author?.name || "Naijup"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Naijup",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/drfvlkzpy/image/upload/v1756673161/naijup_vqwjcx.png"
      }
    },
    "datePublished": blog.publication_date,
    "dateModified": blog.updatedAt || blog.publication_date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`
    },
    "description": firstParagraph(blog.content)?.substring(0, 160) || `Read ${blog.title} on Naijup`,
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
      <BlogPage blog={blog} />
    </>
  );
}
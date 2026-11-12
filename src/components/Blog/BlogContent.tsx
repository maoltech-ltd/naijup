import Image from "next/image";

// List items are HTML strings (list plugin v1) or { content, items } objects (v2).
const ListItems = ({ items, style }: { items: any[]; style?: string }) => {
  const Tag = style === "ordered" ? "ol" : "ul";
  return (
    <Tag className={`mb-4 pl-5 ${style === "ordered" ? "list-decimal" : "list-disc"}`}>
      {items.map((listItem: any, listItemIndex: number) => {
        const html = typeof listItem === "string" ? listItem : listItem?.content || "";
        const children = typeof listItem === "object" ? listItem?.items : null;
        return (
          <li key={listItemIndex} className="mb-1">
            <span dangerouslySetInnerHTML={{ __html: html }} />
            {children?.length ? <ListItems items={children} style={style} /> : null}
          </li>
        );
      })}
    </Tag>
  );
};

const BlogContent = ({ content }: any) => {
  const blocks = Array.isArray(content) ? content : content?.blocks || [];

  return (
    <div className="prose dark:prose-invert max-w-none text-black dark:text-white">
      {blocks.map((item: any, index: any) => {
        // Handle paragraphs
        if (item.type === "paragraph") {
          return (
            <p key={index} className="mb-4 text-lg">
              <span dangerouslySetInnerHTML={{ __html: item.data.text }} />
            </p>
          );
        }

        // Handle headers
        if (item.type === "header") {
          const level = Number(item.data?.level) || 2;
          const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          const sizeClass =
            {
              2: "text-2xl",
              3: "text-xl",
              4: "text-lg",
              5: "text-base",
              6: "text-sm uppercase tracking-wide",
            }[level] || "text-lg";
          return (
            <Tag
              key={index}
              className={`mt-6 mb-3 font-bold text-black dark:text-white ${sizeClass}`}
              dangerouslySetInnerHTML={{ __html: item.data.text }}
            />
          );
        }

        // Handle images. Real dimensions (when the uploader stored them) reserve
        // the right space; otherwise a 16:9 box is reserved. `sizes` matches the
        // ~72ch reading column so phones don't download desktop renditions, and
        // Cloudinary's q_auto replaces the old fixed quality=35 (visibly soft).
        if (item.type === "image") {
          const src = item.data?.file?.url || item.data?.url;
          if (!src) return null;
          const caption = String(item.data?.caption || "").replace(/<[^>]+>/g, "").trim();
          const width = Number(item.data?.file?.width) || 1600;
          const height = Number(item.data?.file?.height) || 900;
          return (
            <figure key={index} className="not-prose my-8">
              <Image
                src={src}
                alt={caption || "Article image"}
                width={width}
                height={height}
                sizes="(max-width: 768px) 100vw, 760px"
                className={`h-auto w-full rounded-xl bg-dark/5 dark:bg-light/5 ${
                  item.data?.withBorder ? "border border-dark/10 dark:border-light/10" : ""
                }`}
              />
              {caption && (
                <figcaption className="mt-3 border-l-2 border-accent/40 pl-3 text-sm leading-6 text-gray dark:border-accentDark/40 dark:text-light/60">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        }

        // Handle tables
        if (item.type === "table") {
          const rows: string[][] = item.data?.content || [];
          const [head, ...body] = item.data?.withHeadings ? rows : [null, ...rows];
          return (
            <div key={index} className="mb-4 overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300">
                {head && (
                  <thead>
                    <tr>
                      {head.map((cell: string, cellIndex: number) => (
                        <th
                          key={cellIndex}
                          className="border border-gray-300 px-4 py-2 text-left font-bold"
                          dangerouslySetInnerHTML={{ __html: cell }}
                        />
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {body.map((row: string[] | null, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {(row || []).map((cell: string, cellIndex: number) => (
                        <td
                          key={cellIndex}
                          className="border border-gray-300 px-4 py-2"
                          dangerouslySetInnerHTML={{ __html: cell }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Handle lists
        if (item.type === "list") {
          return <ListItems key={index} items={item.data?.items || []} style={item.data?.style} />;
        }

        // Handle quotes
        if (item.type === "quote") {
          return (
            <blockquote key={index} className="mb-4 border-l-4 pl-4 italic">
              <span dangerouslySetInnerHTML={{ __html: item.data?.text || "" }} />
            </blockquote>
          );
        }

        // Handle links
        if (item.type === "linkTool") {
          return (
            <a
              key={index}
              href={item.data.link}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.data.link}
            </a>
          );
        }

        // Return null for unsupported types
        return null;
      })}
    </div>
  );
};

export default BlogContent;

import Image from "next/image";

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

        // Handle images
        // Handle images
        if (item.type === "image") {
          return (
            <div key={index} className="mb-8">
              <Image
                src={item.data.file.url} // Corrected URL reference
                alt={item.data.caption || "Image"} // Corrected alt text reference
                width={800}
                height={400}
                quality={35}
                className="object-cover w-full"
              />
              {item.data.caption && (
                <p className="text-center text-sm mt-2">{item.data.caption}</p>
              )}
            </div>
          );
        }

        // Handle tables
        if (item.type === "table") {
          return (
            <table
              key={index}
              className="mb-4 table-auto w-full border-collapse border border-gray-300"
            >
              <tbody>
                {item.data.content.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell: string, cellIndex: number) => (
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
          );
        }

        // Handle ordered lists
        if (item.type === "list" && item.data.style === "ordered") {
          return (
            <ol key={index} className="mb-4 list-decimal pl-5">
              {item.data.items.map(
                (listItem: string, listItemIndex: number) => (
                  <li key={listItemIndex} className="mb-1">
                    {listItem}
                  </li>
                )
              )}
            </ol>
          );
        }

        // Handle unordered lists
        if (item.type === "list" && item.data.style === "unordered") {
          return (
            <ul key={index} className="mb-4 list-disc pl-5">
              {item.data.items.map(
                (listItem: string, listItemIndex: number) => (
                  <li key={listItemIndex} className="mb-1">
                    {listItem}
                  </li>
                )
              )}
            </ul>
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


// const BlogContent: React.FC<any> = ({content}) => {
//   return (
//     <section className="bg-white dark:bg-dark p-8 md:p-10 lg:p-12 xl:p-16">
//         {content.map((item: any, index: number) => (
//         <div key={index} className="prose max-w-full text-black dark:text-white">
//           {item.type === 'text' && (
//             <p className="text-lg">{item.text}</p>
//           )}
//           {item.type === 'image' && (
//             <img src={item.url} alt={item.alt} className="w-full" />
//           )}
//         </div>
//       ))}
//       </section>
//   )
// }

// export default BlogContent;

"use client";
import Image from "next/image";

const BlogContent = ({ content }: any) => {
  return (
    <div>
      {content.map((item: any, index: any) => {
        if (item.type === "paragraph") {
          return (
            <p key={index} className="mb-4 text-lg">
              {item.content}
            </p>
          );
        }

        if (item.type === "image") {
          return (
            <div key={index} className="mb-8">
              <Image
                src={item.src}
                alt={item.alt}
                width={800}
                height={400}
                className="object-cover w-full"
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default BlogContent;

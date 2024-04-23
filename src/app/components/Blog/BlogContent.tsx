
const BlogContent: React.FC<any> = ({content}) => {
  return (
    <section className="bg-white dark:bg-dark p-8 md:p-10 lg:p-12 xl:p-16">
        {content.map((item: any, index: number) => (
        <div key={index} className="prose max-w-full text-black dark:text-white">
          {item.type === 'text' && (
            <p className="text-lg">{item.text}</p>
          )}
          {item.type === 'image' && (
            <img src={item.url} alt={item.alt} className="w-full" />
          )}
        </div>
      ))}
      </section>
  )
}

export default BlogContent;
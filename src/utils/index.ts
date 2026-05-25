export const cs = (...classNames: any) => classNames.filter(Boolean).join("")

export const sortBlogs = (blogs: any) => {
    return (blogs.blogs || []).slice().sort(
        (a: any, b: any) => {
            const bDate = b.publication_date || b.createdAt || b.updatedAt || b.update_date;
            const aDate = a.publication_date || a.createdAt || a.updatedAt || a.update_date;
            return (new Date(bDate) as any) - (new Date(aDate) as any);
        }
    );
};

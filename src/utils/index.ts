export const cs = (...classNames: any) => classNames.filter(Boolean).join("")

export const sortBlogs = (blogs: object[]) => {
    return blogs.slice().sort(
        (a: any, b: any) => {
            return (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any);
        }
    );
};

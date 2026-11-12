export const cs = (...classNames: any) => classNames.filter(Boolean).join(" ")

export const sortBlogs = (blogs: any) => {
    return (blogs.blogs || []).slice().sort(
        (a: any, b: any) => {
            const bDate = b.publication_date || b.createdAt || b.updatedAt || b.update_date;
            const aDate = a.publication_date || a.createdAt || a.updatedAt || a.update_date;
            return (new Date(bDate) as any) - (new Date(aDate) as any);
        }
    );
};

export const formatTag = (tag: string = "") => `#${String(tag).trim().replace(/^#+\s*/, "")}`;

// Plain-text excerpt from Editor.js content (array of blocks or { blocks }).
export const excerptFromContent = (content: any, length = 160) => {
    const blocks = Array.isArray(content) ? content : content?.blocks;
    const text = Array.isArray(blocks)
        ? blocks
            .filter((block: any) => block?.type === "paragraph" || block?.type === "header")
            .map((block: any) => block.data?.text || "")
            .join(" ")
        : String(content || "");
    const clean = text
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();
    if (clean.length <= length) return clean;
    return `${clean.slice(0, length).replace(/\s+\S*$/, "")}…`;
};

// Estimated reading time in minutes (~220 wpm), minimum 1.
export const readingTime = (content: any) => {
    const words = excerptFromContent(content, Number.MAX_SAFE_INTEGER).split(" ").filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
};

export const formatReads = (count?: number) =>
    new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(count ?? 0);

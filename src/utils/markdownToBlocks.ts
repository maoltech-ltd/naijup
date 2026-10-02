// Converts pasted markdown into Editor.js blocks so posts written in markdown
// can be pasted straight into the create-post editor without ## or ** leaking in.

export type MarkdownMeta = {
  title?: string;
  category?: string;
  tags?: string[];
};

type Block = { type: string; data: any };

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inline = (text: string) =>
  escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/__(.+?)__/g, "<b>$1</b>")
    .replace(/(^|[^*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])/g, "$1<i>$2</i>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*/g, "");

const LIST_ITEM = /^\s*([-*+]|\d+\.)\s+/;
const BLOCK_START = /^(#{1,6}\s|\||[-*+]\s|\d+\.\s|>|!\[|---+$|\*\*\*+$)/;

export function looksLikeMarkdown(text: string) {
  return /^(#{1,6}\s|\|.*\||---\s*$)/m.test(text) || /\*\*[^*]+\*\*/.test(text);
}

function parseFrontmatter(src: string): { meta: MarkdownMeta; body: string } {
  const match = src.match(/^\s*---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return { meta: {}, body: src };
  const meta: MarkdownMeta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (key === "tags") {
      try {
        meta.tags = JSON.parse(val);
      } catch {
        meta.tags = val.replace(/[[\]"]/g, "").split(",").map((t) => t.trim()).filter(Boolean);
      }
    } else if (key === "title" || key === "category") {
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      meta[key] = val;
    }
  }
  return { meta, body: src.slice(match[0].length) };
}

const splitRow = (line: string) =>
  line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

export function markdownToBlocks(src: string): { meta: MarkdownMeta; blocks: Block[] } {
  const { meta, body } = parseFrontmatter(src.replace(/\r\n/g, "\n"));
  const lines = body.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const s = lines[i].trim();

    // Blank lines, rules and images (the featured image is uploaded separately).
    if (!s || /^(-{3,}|\*{3,})$/.test(s) || s.startsWith("![")) {
      i++;
      continue;
    }

    const heading = s.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      if (heading[1].length === 1 && !meta.title) {
        meta.title = heading[2].replace(/\*\*/g, "");
      } else {
        const level = Math.min(6, Math.max(2, heading[1].length));
        blocks.push({ type: "header", data: { text: inline(heading[2]), level } });
      }
      i++;
      continue;
    }

    if (s.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const isDivider = (r: string[]) => r.every((c) => /^:?-+:?$/.test(c));
      const withHeadings = rows.length > 1 && isDivider(rows[1]);
      const content = rows.filter((r) => !isDivider(r)).map((r) => r.map(inline));
      blocks.push({ type: "table", data: { withHeadings, content } });
      continue;
    }

    if (LIST_ITEM.test(s)) {
      const style = /^\d+\./.test(s) ? "ordered" : "unordered";
      const items: string[] = [];
      while (i < lines.length && LIST_ITEM.test(lines[i])) {
        items.push(inline(lines[i].replace(LIST_ITEM, "")));
        i++;
      }
      blocks.push({ type: "list", data: { style, items } });
      continue;
    }

    if (s.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "paragraph", data: { text: inline(quote.join(" ")) } });
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !BLOCK_START.test(lines[i].trim())) {
      para.push(lines[i].trim());
      i++;
    }
    if (!para.length) {
      // A line that only looked like a block start; keep it as text.
      para.push(s);
      i++;
    }
    blocks.push({ type: "paragraph", data: { text: inline(para.join(" ")) } });
  }

  return { meta, blocks };
}

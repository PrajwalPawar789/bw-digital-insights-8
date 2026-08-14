/* eslint-disable react-refresh/only-export-components -- parsing helpers also power the article TOC and reading-time calculation. */
import { Fragment, type ReactNode } from "react";

export type ArticleHeading = {
  id: string;
  level: 2 | 3;
  text: string;
};

type ArticleBlock =
  | { type: "heading"; heading: ArticleHeading }
  | { type: "paragraph"; text: string }
  | { type: "unordered-list" | "ordered-list"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "image"; src: string; alt: string; caption?: string };

type GeneratedSection = ArticleHeading & { blockIndex: number };

const LEGACY_SECTION_TITLES = [
  "Article overview",
  "Key details",
  "Background and context",
  "What happens next",
] as const;

const getGeneratedSections = (blockCount: number): GeneratedSection[] => {
  if (blockCount <= 0) return [];

  const sectionCount =
    blockCount === 1 ? 1 : Math.min(4, Math.ceil(blockCount / 2) + 1);

  return Array.from({ length: sectionCount }, (_, index) => {
    const blockIndex = Math.floor((index * blockCount) / sectionCount);
    const text = LEGACY_SECTION_TITLES[index];
    return {
      id: index === 0 ? "article-overview" : headingId(text, index),
      level: 2 as const,
      text,
      blockIndex,
    };
  });
};

const getHtmlBlockCount = (content: string) =>
  Array.from(
    content.matchAll(/<(?:p|ul|ol|figure|blockquote)\b[^>]*>/gi)
  ).length;

const stripTags = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

const headingId = (text: string, index: number) => {
  const base = text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return `${base || "section"}-${index + 1}`;
};

const looksLikeHeading = (value: string) => {
  const text = value.trim();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    text.length >= 3 &&
    text.length <= 105 &&
    words.length <= 14 &&
    /^[A-Z0-9]/.test(text) &&
    !/[.!?…,:;!”"')\]]$/.test(text) &&
    !/^https?:\/\//i.test(text)
  );
};

const parseMarkdownImage = (value: string) => {
  const match = value.match(
    /^!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)$/
  );
  if (!match) return null;
  return { alt: match[1] || "Article image", src: match[2], caption: match[3] };
};

export const parseArticleBlocks = (content: string): ArticleBlock[] => {
  const normalized = content.replace(/\r/g, "").trim();
  if (!normalized || /<(?:p|h[1-6]|ul|ol|figure|blockquote|img)\b/i.test(normalized)) {
    return [];
  }

  const blocks: ArticleBlock[] = [];
  let headingIndex = 0;

  normalized
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .forEach((block) => {
      const image = parseMarkdownImage(block);
      if (image) {
        blocks.push({ type: "image", ...image });
        return;
      }

      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      if (!lines.length) return;

      const markdownHeading = lines[0].match(/^(#{2,3})\s+(.+)$/);
      const inferredHeading =
        !markdownHeading && looksLikeHeading(lines[0]) &&
        (lines.length > 1 || lines.length === 1);

      if (markdownHeading || inferredHeading) {
        const text = (markdownHeading?.[2] || lines[0]).trim();
        const level: 2 | 3 = markdownHeading?.[1].length === 3 ? 3 : 2;
        blocks.push({
          type: "heading",
          heading: { id: headingId(text, headingIndex++), level, text },
        });
        lines.shift();
      }

      if (!lines.length) return;

      if (lines.every((line) => /^[-*•]\s+/.test(line))) {
        blocks.push({
          type: "unordered-list",
          items: lines.map((line) => line.replace(/^[-*•]\s+/, "")),
        });
        return;
      }

      if (lines.every((line) => /^\d+[.)]\s+/.test(line))) {
        blocks.push({
          type: "ordered-list",
          items: lines.map((line) => line.replace(/^\d+[.)]\s+/, "")),
        });
        return;
      }

      if (lines.every((line) => /^>\s?/.test(line))) {
        blocks.push({
          type: "blockquote",
          text: lines.map((line) => line.replace(/^>\s?/, "")).join(" "),
        });
        return;
      }

      blocks.push({ type: "paragraph", text: lines.join("\n") });
    });

  return blocks;
};

export const extractArticleHeadings = (content: string): ArticleHeading[] => {
  if (/<(?:h2|h3)\b/i.test(content)) {
    let index = 0;
    return Array.from(content.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi))
      .map((match) => {
        const text = stripTags(match[2]);
        if (!text) return null;
        return {
          id: headingId(text, index++),
          level: Number(match[1]) as 2 | 3,
          text,
        };
      })
      .filter((heading): heading is ArticleHeading => Boolean(heading));
  }

  if (/<(?:p|ul|ol|figure|blockquote|img)\b/i.test(content)) {
    return getGeneratedSections(getHtmlBlockCount(content)).map(
      ({ blockIndex: _blockIndex, ...heading }) => heading
    );
  }

  const blocks = parseArticleBlocks(content);
  const explicitHeadings = blocks
    .filter(
      (block): block is Extract<ArticleBlock, { type: "heading" }> =>
        block.type === "heading"
    )
    .map((block) => block.heading);

  if (explicitHeadings.length) return explicitHeadings;

  return getGeneratedSections(blocks.length).map(
    ({ blockIndex: _blockIndex, ...heading }) => heading
  );
};

export const getArticleWordCount = (content: string) =>
  stripTags(content.replace(/[#>*_![\]()]/g, " "))
    .split(/\s+/)
    .filter(Boolean).length;

const safeUrl = (value: string, allowImage = false) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (/^(https?:\/\/|\/)/i.test(trimmed)) return trimmed;
  if (allowImage && /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(trimmed)) {
    return trimmed;
  }
  return "";
};

const renderInline = (text: string): ReactNode[] => {
  const tokenPattern = /(\*\*[^*]+\*\*|\*[^*\n]+\*|\[[^\]]+\]\([^)]+\))/g;
  const pieces = text.split(tokenPattern).filter(Boolean);

  return pieces.map((piece, index) => {
    const bold = piece.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={`${index}-${piece}`}>{bold[1]}</strong>;

    const italic = piece.match(/^\*([^*]+)\*$/);
    if (italic) return <em key={`${index}-${piece}`}>{italic[1]}</em>;

    const link = piece.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = safeUrl(link[2]);
      return href ? (
        <a
          key={`${index}-${piece}`}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {link[1]}
        </a>
      ) : (
        <Fragment key={`${index}-${piece}`}>{link[1]}</Fragment>
      );
    }

    return <Fragment key={`${index}-${piece}`}>{piece}</Fragment>;
  });
};

const sanitizeArticleHtml = (html: string) => {
  if (typeof window === "undefined") return "";
  const documentNode = new DOMParser().parseFromString(html, "text/html");
  const allowedTags = new Set([
    "P",
    "H2",
    "H3",
    "H4",
    "UL",
    "OL",
    "LI",
    "STRONG",
    "B",
    "EM",
    "I",
    "A",
    "IMG",
    "FIGURE",
    "FIGCAPTION",
    "BLOCKQUOTE",
    "BR",
    "SPAN",
  ]);
  let headingIndex = 0;

  Array.from(documentNode.body.querySelectorAll("*")).forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const allowed =
        (element.tagName === "A" && ["href", "title"].includes(attribute.name)) ||
        (element.tagName === "IMG" &&
          ["src", "data-lazy-src", "alt", "title", "width", "height"].includes(
            attribute.name
          ));
      if (!allowed) element.removeAttribute(attribute.name);
    });

    if (element.tagName === "A") {
      const href = safeUrl(element.getAttribute("href") || "");
      if (href) {
        element.setAttribute("href", href);
        if (href.startsWith("http")) {
          element.setAttribute("target", "_blank");
          element.setAttribute("rel", "noopener noreferrer");
        }
      } else {
        element.removeAttribute("href");
      }
    }

    if (element.tagName === "IMG") {
      const lazySource = element.getAttribute("data-lazy-src");
      const source = safeUrl(lazySource || element.getAttribute("src") || "", true);
      if (source) element.setAttribute("src", source);
      else element.remove();
      element.removeAttribute("data-lazy-src");
      element.setAttribute("loading", "lazy");
      element.setAttribute("decoding", "async");
    }

    if (element.tagName === "H2" || element.tagName === "H3") {
      element.setAttribute(
        "id",
        headingId(element.textContent?.trim() || "section", headingIndex++)
      );
    }
  });

  if (!documentNode.body.querySelector("h2, h3")) {
    const contentBlocks = Array.from(documentNode.body.children).filter((element) =>
      ["P", "UL", "OL", "FIGURE", "BLOCKQUOTE", "IMG"].includes(
        element.tagName
      )
    );

    getGeneratedSections(contentBlocks.length)
      .slice()
      .reverse()
      .forEach((section) => {
        const target = contentBlocks[section.blockIndex];
        if (!target) return;
        const heading = documentNode.createElement("h2");
        heading.id = section.id;
        heading.textContent = section.text;
        target.before(heading);
      });
  }

  return documentNode.body.innerHTML;
};

const ArticleBody = ({ content }: { content: string }) => {
  const containsHtml = /<(?:p|h[1-6]|ul|ol|figure|blockquote|img)\b/i.test(
    content
  );

  if (containsHtml) {
    return (
      <div
        id="article-overview"
        className="article-editorial-copy"
        dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(content) }}
      />
    );
  }

  const blocks = parseArticleBlocks(content);
  const hasExplicitHeadings = blocks.some((block) => block.type === "heading");
  const generatedSections = hasExplicitHeadings
    ? []
    : getGeneratedSections(blocks.length);

  return (
    <div
      id={hasExplicitHeadings ? "article-overview" : undefined}
      className="article-editorial-copy"
    >
      {blocks.map((block, index) => {
        const generatedHeading = generatedSections.find(
          (section) => section.blockIndex === index
        );
        const sectionHeading = generatedHeading ? (
          <h2 key={`generated-${generatedHeading.id}`} id={generatedHeading.id}>
            {generatedHeading.text}
          </h2>
        ) : null;

        if (block.type === "heading") {
          const Heading = block.heading.level === 3 ? "h3" : "h2";
          return (
            <Heading key={block.heading.id} id={block.heading.id}>
              {block.heading.text}
            </Heading>
          );
        }
        if (block.type === "unordered-list" || block.type === "ordered-list") {
          const List = block.type === "ordered-list" ? "ol" : "ul";
          return (
            <Fragment key={`${block.type}-${index}`}>
              {sectionHeading}
              <List>
                {block.items.map((item, itemIndex) => (
                  <li key={`${itemIndex}-${item}`}>{renderInline(item)}</li>
                ))}
              </List>
            </Fragment>
          );
        }
        if (block.type === "blockquote") {
          return (
            <Fragment key={`quote-${index}`}>
              {sectionHeading}
              <blockquote>{renderInline(block.text)}</blockquote>
            </Fragment>
          );
        }
        if (block.type === "image") {
          const source = safeUrl(block.src, true);
          if (!source) return null;
          return (
            <Fragment key={`${block.src}-${index}`}>
              {sectionHeading}
              <figure>
                <img src={source} alt={block.alt} loading="lazy" decoding="async" />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            </Fragment>
          );
        }
        return (
          <Fragment key={`paragraph-${index}`}>
            {sectionHeading}
            <p>{renderInline(block.text)}</p>
          </Fragment>
        );
      })}
    </div>
  );
};

export default ArticleBody;

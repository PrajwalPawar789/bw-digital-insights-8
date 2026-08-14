import { useRef } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleBody from "@/components/articles/ArticleBody";
import { useImageUpload } from "@/hooks/useImageUpload";

type ArticleContentEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  uploadFolder?: string;
  placeholder?: string;
};

const ArticleContentEditor = ({
  id,
  value,
  onChange,
  required,
  uploadFolder = "articles/content",
  placeholder =
    "Write the introduction, then add headings with the toolbar. Headings automatically build the article table of contents.",
}: ArticleContentEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inlineImageRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  const insert = (before: string, after = "", fallback = "Text") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(`${value}${value ? "\n\n" : ""}${before}${fallback}${after}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || fallback;
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    onChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + before.length + selected.length + after.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  const insertBlock = (template: string) => {
    const separator = value.trim() ? "\n\n" : "";
    onChange(`${value.trimEnd()}${separator}${template}\n\n`);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const handleInlineImage = async (file?: File) => {
    if (!file) return;
    const url = await uploadImage(file, uploadFolder);
    insertBlock(`![Describe this image](${url} "Source: Add image source")`);
    if (inlineImageRef.current) inlineImageRef.current.value = "";
  };

  const tools = [
    {
      label: "Heading 2",
      Icon: Heading2,
      action: () => insertBlock("## Section heading"),
    },
    {
      label: "Heading 3",
      Icon: Heading3,
      action: () => insertBlock("### Subheading"),
    },
    {
      label: "Bold",
      Icon: Bold,
      action: () => insert("**", "**", "important text"),
    },
    {
      label: "Italic",
      Icon: Italic,
      action: () => insert("*", "*", "emphasized text"),
    },
    {
      label: "Link",
      Icon: Link2,
      action: () => insert("[", "](https://example.com)", "link text"),
    },
    {
      label: "Bulleted list",
      Icon: List,
      action: () => insertBlock("- First point\n- Second point\n- Third point"),
    },
    {
      label: "Numbered list",
      Icon: ListOrdered,
      action: () => insertBlock("1. First step\n2. Second step\n3. Third step"),
    },
    {
      label: "Quote",
      Icon: Quote,
      action: () => insertBlock("> Add a highlighted quotation"),
    },
  ];

  return (
    <Tabs defaultValue="write" className="rounded-lg border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 p-2">
        <TabsList className="h-8">
          <TabsTrigger value="write" className="h-7 px-3 text-xs">
            Write
          </TabsTrigger>
          <TabsTrigger value="preview" className="h-7 px-3 text-xs">
            Preview
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-wrap gap-1" aria-label="Article formatting tools">
          {tools.map(({ label, Icon, action }) => (
            <Button
              key={label}
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              aria-label={label}
              title={label}
              onClick={action}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
          <input
            ref={inlineImageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleInlineImage(event.target.files?.[0])}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-2 text-xs"
            disabled={uploading}
            onClick={() => inlineImageRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
            {uploading ? "Uploading" : "Inline image"}
          </Button>
        </div>
      </div>

      <TabsContent value="write" className="m-0">
        <Textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={18}
          required={required}
          className="min-h-[360px] resize-y rounded-none border-0 font-mono text-sm leading-6 focus-visible:ring-0"
          placeholder={placeholder}
        />
        <p className="border-t border-neutral-200 bg-neutral-50 px-3 py-2 text-xs leading-5 text-neutral-600">
          Use blank lines between paragraphs. Headings build the “In This Article” menu automatically. Inline images support a caption/source in quotation marks.
        </p>
      </TabsContent>

      <TabsContent value="preview" className="m-0 min-h-[360px] bg-white p-5">
        {value.trim() ? (
          <ArticleBody content={value} />
        ) : (
          <p className="text-sm text-neutral-500">Nothing to preview yet.</p>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ArticleContentEditor;

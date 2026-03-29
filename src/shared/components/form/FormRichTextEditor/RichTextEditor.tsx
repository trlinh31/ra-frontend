import { cn } from "@/shared/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { useEffect } from "react";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type='button'
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "hover:bg-muted disabled:opacity-40 p-1.5 rounded transition-colors disabled:cursor-not-allowed",
        active && "bg-muted text-primary"
      )}>
      {children}
    </button>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  invalid?: boolean;
}

export default function RichTextEditor({ value, onChange, placeholder, className, invalid }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Nhập nội dung..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const normalized = current === "<p></p>" ? "" : current;
    if (normalized !== value) {
      editor.commands.setContent(value ?? "");
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={cn("bg-background border rounded-md overflow-hidden", invalid && "border-destructive", className)}>
      {/* Toolbar */}
      <div className='flex flex-wrap items-center gap-0.5 bg-muted/30 px-2 py-1.5 border-b'>
        <ToolbarButton title='In đậm' onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton title='In nghiêng' onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton title='Gạch dưới' onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
          <UnderlineIcon className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton title='Gạch ngang' onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>
          <Strikethrough className='w-4 h-4' />
        </ToolbarButton>

        <div className='mx-1 bg-border w-px h-5' />

        <ToolbarButton
          title='Tiêu đề 1'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}>
          <Heading1 className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          title='Tiêu đề 2'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}>
          <Heading2 className='w-4 h-4' />
        </ToolbarButton>

        <div className='mx-1 bg-border w-px h-5' />

        <ToolbarButton title='Danh sách chấm' onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton title='Danh sách số' onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered className='w-4 h-4' />
        </ToolbarButton>

        <div className='mx-1 bg-border w-px h-5' />

        <ToolbarButton
          title='Căn trái'
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}>
          <AlignLeft className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          title='Căn giữa'
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}>
          <AlignCenter className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton
          title='Căn phải'
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}>
          <AlignRight className='w-4 h-4' />
        </ToolbarButton>

        <div className='mx-1 bg-border w-px h-5' />

        <ToolbarButton title='Hoàn tác' onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className='w-4 h-4' />
        </ToolbarButton>
        <ToolbarButton title='Làm lại' onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className='w-4 h-4' />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        className='[&_.tiptap_p.is-editor-empty:first-child::before]:float-left px-3 py-2 [&_.tiptap]:outline-none focus-within:outline-none max-w-none [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 min-h-36 [&_.tiptap]:min-h-32 [&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none prose prose-sm'
      />
    </div>
  );
}

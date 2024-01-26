import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useState, forwardRef } from "react";

import type { HTML } from "~/features/markdown";

const RichTextEditor = forwardRef<
  HTMLInputElement,
  {
    defaultValue?: HTML;
    id: string;
    name: string;
    ariaInvalid?: boolean | undefined;
    ariaErrorMessage?: string | undefined;
    ariaDescribedBy?: string | undefined;
  }
>(function RichTextEditor(
  { defaultValue, id, name, ariaInvalid, ariaErrorMessage, ariaDescribedBy },
  ref,
) {
  const [valueToSave, setValueToSave] = useState<string>(defaultValue ?? "");

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "p-1 *:text-black *:text-base min-h-[200px] ",
      },
    },
    extensions: [
      TextStyle,
      StarterKit,
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "font-bold text-green-500",
        },
      }),
      Placeholder.configure({
        // Use a placeholder:
        placeholder: "Write something …",
        // Use different placeholders depending on the node type:
        // placeholder: ({ node }) => {
        //   if (node.type.name === 'heading') {
        //     return 'What’s the title?'
        //   }

        //   return 'Can you add some further context?'
        // },
      }),
    ],
    content: defaultValue,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValueToSave(html);
    },
  });

  return (
    <div className="rounded bg-white">
      <input
        ref={ref}
        type="hidden"
        name={name}
        id={id}
        aria-invalid={ariaInvalid}
        aria-errormessage={ariaErrorMessage}
        aria-describedby={ariaDescribedBy}
        value={valueToSave}
      />
      {editor ? <EditorContent editor={editor} /> : null}
    </div>
  );
});
export default RichTextEditor;

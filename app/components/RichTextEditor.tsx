import { Dialog } from "@headlessui/react";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import classNames from "classnames";
import { useState, forwardRef, useCallback } from "react";
import {
  Italic,
  Bold,
  Link as LinkIcon,
  RotateCw,
  RotateCcw,
} from "react-feather";

import type { HTML } from "~/features/markdown";

// TODO:
// I'd love to have the controls appear when you highlight text - like on linear...
const EditorC = ({ editor }: { editor: Editor }) => {
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [previousUrl, setPreviousUrl] = useState("");
  const setLink = useCallback(
    (url: string) => {
      // cancelled
      if (url === null) {
        setAddLinkModalOpen(false);
        return;
      }

      // empty
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();

        setAddLinkModalOpen(false);
        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: withHttps(url) })
        .run();
      setAddLinkModalOpen(false);
    },
    [setAddLinkModalOpen, editor],
  );

  return (
    <>
      <div className="flex w-full gap-4 rounded-t-md bg-neutral-300 p-3 dark:bg-neutral-600">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <RotateCcw
            className={classNames("stroke-base h-4 w-4", {
              "stroke-disabled": !editor.can().chain().focus().undo().run(),
            })}
          />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <RotateCw
            className={classNames("stroke-base h-4 w-4", {
              "stroke-disabled": !editor.can().chain().focus().redo().run(),
            })}
          />
        </button>
        <div className="ml-2" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "font-bold" : ""}
        >
          <Bold
            className={classNames("stroke-base h-4 w-4", {
              "stroke-[3px]": editor.isActive("bold"),
              "stroke-disabled": !editor
                .can()
                .chain()
                .focus()
                .toggleBold()
                .run(),
            })}
          />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "font-bold" : ""}
        >
          <Italic
            className={classNames("stroke-base h-4 w-4", {
              "stroke-[3px]": editor.isActive("italic"),
              "stroke-disabled": !editor
                .can()
                .chain()
                .focus()
                .toggleItalic()
                .run(),
            })}
          />
        </button>

        <button
          type="button"
          onClick={() => {
            const purl = editor.getAttributes("link").href;
            setPreviousUrl(purl);
            setAddLinkModalOpen(true);
          }}
          className={editor.isActive("link") ? "font-bold" : ""}
        >
          <LinkIcon
            className={classNames("stroke-base h-4 w-4", {
              "stroke-[3px]": editor.isActive("link"),
            })}
          />
        </button>
        {/*<button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
        >
          unsetLink
        </button>*/}
      </div>
      <EditorContent editor={editor} />

      <AddLinkDialog
        addLinkModalOpen={addLinkModalOpen}
        setAddLinkModalOpen={setAddLinkModalOpen}
        setLink={setLink}
        previousUrl={previousUrl}
      />
    </>
  );
};

const withHttps = (url: string) =>
  url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) =>
    schemma ? match : `https://${nonSchemmaUrl}`,
  );

const AddLinkDialog = ({
  addLinkModalOpen,
  setAddLinkModalOpen,
  setLink,
  previousUrl,
}: {
  addLinkModalOpen: boolean;
  setAddLinkModalOpen: (v: boolean) => void;
  setLink: (url: string) => void;
  previousUrl?: string;
}) => {
  // TODO: pass in the previous url into the dialog
  // const url = window.prompt("URL", previousUrl);

  const [l, setL] = useState("");
  return (
    <Dialog
      open={addLinkModalOpen}
      onClose={() => setAddLinkModalOpen(false)}
      className="relative z-50 w-full"
    >
      <div
        className="fixed inset-0 w-full bg-neutral-300/70 blur-lg dark:bg-neutral-800/70"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="rounded bg-white p-6 dark:bg-neutral-800">
          <form>
            <div>
              <input
                defaultValue={previousUrl}
                placeholder="Enter link URL"
                type="string"
                name="linkUrl"
                onChange={(e) => setL(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button type="submit" onClick={() => setLink(l)}>
                add
              </button>
              <button type="button" onClick={() => setLink("")}>
                remove link
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

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
        class:
          "p-4 min-h-[200px] markdown prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl  focus:outline-none",
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
    <div className="rounded-md bg-neutral-100  shadow-xl dark:bg-neutral-800">
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
      {editor ? <EditorC editor={editor} /> : null}
    </div>
  );
});
export default RichTextEditor;

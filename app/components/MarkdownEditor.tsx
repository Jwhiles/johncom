import { defaultKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import React, { useState } from "react";

import { uploadImage } from "~/features/richtext/imageUpload";
import { marked } from "~/utils/marked";

export const MarkdownEditor = ({
  id,
  name,
  defaultValue = "",
}: {
  id: string;
  name: string;
  defaultValue?: string;
}) => {
  const [content, setContent] = useState(defaultValue);
  const [previewShown, setPreviewShown] = useState<boolean>(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const startState = EditorState.create({
      doc: content,
      extensions: [
        basicSetup,
        keymap.of(defaultKeymap),
        markdown(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setContent(update.state.doc.toString());
          }
        }),
        EditorView.domEventHandlers({
          drop(event, view) {
            event.preventDefault();
            const files = event.dataTransfer?.files;
            if (!files?.length) return;

            const file = files[0];
            if (!file.type.startsWith("image/")) return;

            uploadImage(file).then((publicUrl) => {
              const imageMarkdown = `![${file.name}](${publicUrl})`;
              const pos = view.posAtCoords({
                x: event.clientX,
                y: event.clientY,
              });
              if (pos !== null) {
                view.dispatch({
                  changes: {
                    from: pos,
                    insert: imageMarkdown,
                  },
                });
              }
            });
          },
          paste(event, view) {
            const files = event.clipboardData?.files;
            if (!files?.length) return;

            const file = files[0];
            if (!file.type.startsWith("image/")) return;

            uploadImage(file).then((publicUrl) => {
              const imageMarkdown = `![${file.name}](${publicUrl})`;
              const pos = view.state.selection.main.head;
              view.dispatch({
                changes: {
                  from: pos,
                  insert: imageMarkdown,
                },
              });
            });
          },
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: ref.current,
    });

    return () => {
      view.destroy();
    };
  }, []);

  return (
    <div className="rounded-lg">
      <input type="hidden" id={id} name={name} value={content} />

      <div ref={ref} className={previewShown ? "hidden" : "bg-white"} />

      <div
        className={previewShown ? "" : "hidden"}
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      />
      <div className="mt-2">
        <button type="button" onClick={() => setPreviewShown(!previewShown)}>
          {previewShown ? "Edit" : "Preview"}
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;

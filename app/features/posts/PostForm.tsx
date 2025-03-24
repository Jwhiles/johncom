import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { z } from "zod";

import { MarkdownEditor } from "~/components/MarkdownEditor";
import { CheckboxInput } from "~/features/forms/CheckboxInput";
import { Input } from "~/features/forms/Input";
import dayjs from "~/utils/dayjs";

interface CreateForm {
  type: "create";
}
interface EditForm {
  type: "edit";
  title: string;
  slug: string;
  body: string;
  tags: Array<string>;
  createdDate: string;
  draft: boolean;
}

interface PostFormProps {
  mode: CreateForm | EditForm;
}

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Post content is required"),
  tags: z.string().transform((str) =>
    str
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
  ),
  createdDate: z.string(),
  slug: z.string(),
  readyToPublish: z.union([
    z.literal("on").transform(() => true),
    z.literal(undefined).transform(() => false),
  ]),
});
export const validator = withZod(PostSchema);
export function PostForm({ mode }: PostFormProps) {
  const form = useForm(
    mode.type === "create"
      ? { validator, method: "POST" }
      : {
          validator,
          method: "PUT",
          defaultValues: {
            title: mode.title,
            slug: mode.slug,
            body: mode.body,
            tags: mode.tags.join(","),
            readyToPublish: !mode.draft,
          },
        },
  );

  return (
    <form className="flex flex-col gap-4" {...form.getFormProps()}>
      <input
        type="hidden"
        name="createdDate"
        value={mode.type === "edit" ? mode.createdDate : dayjs().toISOString()}
      />
      <Input
        scope={form.scope("title")}
        name="title"
        label="Title"
        type="text"
        placeholder="Title"
      />

      <Input
        scope={form.scope("slug")}
        name="slug"
        label="Slug"
        type="text"
        placeholder="Slug"
      />

      <div>
        <label htmlFor="body" className="block text-sm font-medium">
          Content
        </label>
        <MarkdownEditor
          id="body"
          name="body"
          defaultValue={mode.type === "edit" ? mode.body : undefined}
        />
      </div>

      <Input
        scope={form.scope("tags")}
        name="tags"
        label="Tags (comma-separated)"
        type="text"
        placeholder="javascript, react, web"
      />

      <CheckboxInput
        scope={form.scope("readyToPublish")}
        name="readyToPublish"
        label="Ready to Publish"
        placeholder=""
      />

      <button disabled={form.formState.isSubmitting} type="submit">
        {mode.type === "edit" ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
}

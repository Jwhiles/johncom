import { FormScope, useField, useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import { z } from "zod";

import { MarkdownEditor } from "~/components/MarkdownEditor";

dayjs.extend(utc);
dayjs.extend(timezone);

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
  hackerNewsLink: string | null;
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
  hackerNewsLink: z
    .union([z.string().url().optional(), z.literal("")])
    .transform((s) => (s === "" ? undefined : s)),
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
            hackerNewsLink: mode.hackerNewsLink ?? "",
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
      <MyInput
        scope={form.scope("title")}
        name="title"
        label="Title"
        type="text"
        placeholder="Title"
      />

      <MyInput
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

      <MyInput
        scope={form.scope("tags")}
        name="tags"
        label="Tags (comma-separated)"
        type="text"
        placeholder="javascript, react, web"
      />
      <MyInput
        scope={form.scope("hackerNewsLink")}
        name="hackerNewsLink"
        label="Hacker News Links"
        type="text"
        placeholder=""
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

const CheckboxInput = ({
  scope,
  name,
  label,
  placeholder,
}: {
  scope: FormScope<boolean>;
  name: string;
  label: string;
  placeholder: string;
}) => {
  const { error, getInputProps } = useField(scope);

  return (
    <>
      <label htmlFor={name} className="mb-1 block text-xs font-bold">
        {label}
      </label>
      <input
        {...getInputProps({ id: name, placeholder, type: "checkbox" })}
        className="w-1/2"
      />
      {error ? (
        <span className="text-md mt-1 block text-red-300">{error()}</span>
      ) : null}
    </>
  );
};
const MyInput = ({
  scope,
  name,
  label,
  type,
  placeholder,
}: {
  scope: FormScope<string>;
  name: string;
  label: string;
  type: string;
  placeholder: string;
}) => {
  const { error, getInputProps } = useField(scope);

  return (
    <>
      <label htmlFor={name} className="mb-1 block text-xs font-bold">
        {label}
      </label>
      <input
        {...getInputProps({ id: name, placeholder, type })}
        className="w-1/2"
      />
      {error ? (
        <span className="text-md mt-1 block text-red-300">{error()}</span>
      ) : null}
    </>
  );
};

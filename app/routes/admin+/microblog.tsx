import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { FormScope, useField, useForm, validationError } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import { useRef } from "react";
import { z } from "zod";

import { requireAdmin, requireAdminId } from "~/auth.server";
import RichTextEditor from "~/components/RichTextEditor";
import { prisma } from "~/db.server";
import * as BlueSky from "~/features/bluesky/index.server";
import { stripAllHtml } from "~/features/markdown/index.server";
import { getCurrentLocalDateTime } from "~/utils/formatDate";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdmin(request);
  return null;
}

const MicroBlogSchema = z.object({
  content: z.string(),
  createdDate: z.string(),
  inReplyToUrl: z
    .union([z.string().url().optional(), z.literal("")])
    .transform((s) => (s === "" ? undefined : s)),
  inReplyToAuthor: z
    .union([z.string().optional(), z.literal("")])
    .transform((s) => (s === "" ? undefined : s)),
  inReplyToTitle: z
    .union([z.string().optional(), z.literal("")])
    .transform((s) => (s === "" ? undefined : s)),
});

const validator = withZod(MicroBlogSchema);

export async function action({ request }: ActionFunctionArgs) {
  const adminId = await requireAdminId(request);

  if (request.method === "POST") {
    const result = await validator.validate(await request.formData());
    if (result.error) {
      return validationError(result.error, result.submittedData);
    }

    await prisma.note.create({
      data: {
        content: result.data.content,
        createdAt: result.data.createdDate,
        updatedAt: result.data.createdDate,
        createdBy: {
          connect: { id: adminId },
        },
        inReplyToUrl: result.data.inReplyToUrl,
        inReplyToAuthor: result.data.inReplyToAuthor,
        inReplyToTitle: result.data.inReplyToTitle,
      },
    });

    // Post to BlueSky
    await BlueSky.makePost(
      stripAllHtml(result.data.content),
      result.data.createdDate,
    );

    return redirect("/admin");
  }

  throw new Response("invalid method", { status: 400 });
}

export default function MicroBlog() {
  const createdDate = useRef(getCurrentLocalDateTime());
  const form = useForm({ validator, method: "POST" });

  return (
    <form className="flex flex-col gap-4" {...form.getFormProps()}>
      <RichTextEditor
        editorClassNames="p-1 *:text-black *:text-base min-h-[200px] "
        id="content"
        name="content"
      />
      <input type="hidden" name="createdDate" value={createdDate.current} />
      <MyInput
        scope={form.scope("inReplyToUrl")}
        label="In reply to URL"
        placeholder="https://inreplyto.com"
        type="text"
        name="inReplyToUrl"
      />
      <MyInput
        scope={form.scope("inReplyToTitle")}
        label="In reply to title"
        placeholder="In reply to title"
        type="text"
        name="inReplyToTitle"
      />
      <MyInput
        scope={form.scope("inReplyToAuthor")}
        label="In reply to author"
        placeholder="In reply to author"
        type="text"
        name="inReplyToAuthor"
      />
      <button disabled={form.formState.isSubmitting} type="submit">
        Save
      </button>
    </form>
  );
}

const MyInput = ({
  scope,
  name,
  label,
  type,
  placeholder,
}: {
  scope: FormScope<{ name: string }>;
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

import { PrismaClient } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";

import { requireAdmin } from "~/auth.server";
import { getListOfEntries } from "~/contentful.server";

const prisma = new PrismaClient();

interface ContentfulTag {
  sys: { id: string };
  fields: { tagName: string };
}

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireAdmin(request);
  const DRY_RUN = false;

  async function migrateAndMapTags(
    contentfulTags: Array<ContentfulTag>,
    prisma: PrismaClient,
  ): Promise<Map<string, string>> {
    const tagMap = new Map<string, string>();

    if (DRY_RUN) {
      console.log(`[DRY RUN] Processing tags`);
    }

    for (const tag of contentfulTags) {
      const tagName = tag.fields.tagName;
      const slug = tagName.toLowerCase().replace(/\s+/g, "-");
      const dbTag = await mockPrismaOperation(
        () =>
          prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: {
              name: tagName,
              slug: slug,
            },
          }),
        `upsert tag "${tagName}"`,
      );

      tagMap.set(tag.sys.id, dbTag.id);
    }

    return tagMap;
  }

  async function migrateContentfulToPrisma() {
    try {
      // 1. Get all posts from Contentful
      console.log("Fetching posts from Contentful...");
      const contentfulPosts = await getListOfEntries({ limit: 1000 });
      console.log(`Found ${contentfulPosts.items.length} posts`);

      console.log(`Found ${contentfulPosts.includes.Entry.length} tags`);

      // 2. Migrate tags and create a mapping of old tag IDs to new tag IDs
      const tagMap = await migrateAndMapTags(
        contentfulPosts.includes.Entry,
        prisma,
      );

      // 2. Get the admin user who will be set as the author
      const admin = await prisma.admin.findFirst();
      if (!admin) {
        throw new Error("No admin user found in the database");
      }

      // 3. Create a mapping of old slugs to new post IDs
      const slugToIdMap = new Map<string, string>();

      // 4. Migrate each post
      console.log("Migrating posts...");
      for (const post of contentfulPosts.items) {
        const tagIds = post.fields.tag
          .map((tag) => tagMap.get(tag.sys.id))
          .filter((id): id is string => id !== undefined);
        const newPost = await mockPrismaOperation(
          () =>
            prisma.post.create({
              data: {
                title: post.fields.title,
                slug: post.fields.slug,
                body: post.fields.body,
                date: new Date(post.fields.date),
                hackerNewsLink: post.fields.hackerNewsLink || null,
                author: {
                  connect: {
                    id: admin.id,
                  },
                },
                tags: {
                  connect: tagIds.map((id) => ({ id })),
                },
              },
            }),
          `create post "${post.fields.title}"`,
        );

        slugToIdMap.set(post.fields.slug, newPost.id);
        console.log(`Migrated post: ${post.fields.slug}`);

        console.log(
          `Connected ${tagIds.length} tags to post ${post.fields.slug}`,
        );
      }

      // 5. Update all comments to point to the new post IDs
      console.log("Updating comment references...");
      const comments = await prisma.comment.findMany();

      for (const comment of comments) {
        const post = await prisma.post.findFirst({
          where: {
            slug: comment.postId, // Assuming postId was previously storing the slug
          },
        });

        if (post) {
          await mockPrismaOperation(
            () =>
              prisma.comment.update({
                where: { id: comment.id },
                data: { postId: post.id },
              }),
            `update comment ${comment.id} to reference post ${post.id}`,
          );
          console.log(
            `Updated comment ${comment.id} to reference post ${post.id}`,
          );
        } else {
          console.warn(
            `Could not find post for comment ${comment.id} with postId ${comment.postId}`,
          );
        }
      }

      console.log("Migration completed successfully!");
    } catch (error) {
      console.error("Migration failed:", error);
      throw error;
    }
  }

  function mockPrismaOperation<T>(
    operation: () => Promise<T>,
    description: string,
  ): Promise<T> {
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would ${description}`);
      return Promise.resolve({} as T);
    }
    return operation();
  }

  await migrateContentfulToPrisma();
};

export const loader = async ({ request }: ActionFunctionArgs) => {
  await requireAdmin(request);

  return null;
};

export default function MigrateContentful() {
  // render a button that triggers the action when clicked
  //

  return (
    <Form method="POST">
      <button type="submit">migrate</button>
    </Form>
  );
}

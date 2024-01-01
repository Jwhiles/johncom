import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  await prisma.admin.deleteMany();
  const password = await bcrypt.hash("password", 10);
  await prisma.admin.create({
    data: {
      email: "john@example.com",
      password: {
        create: {
          hash: password,
        },
      },
    },
  });

  await prisma.comment.create({
    data: {
      content: "Not approved is a comment",
      authorEmail: "john@example.com",
      postId: "local-fake",
      name: "John",
      responseToId: null,
    },
  });
  await prisma.comment.create({
    data: {
      content: "Approved comment",
      authorEmail: "john@example.com",
      postId: "local-fake",
      name: "John",
      responseToId: null,
      approved: true,
    },
  });
  const approvedWithReply = await prisma.comment.create({
    data: {
      content: "Approved comment with reply",
      authorEmail: "john@example.com",
      postId: "local-fake",
      name: "John",
      responseToId: null,
      approved: true,
    },
  });
  await prisma.comment.create({
    data: {
      content: "Approved reply",
      authorEmail: "john@example.com",
      postId: "local-fake",
      name: "John",
      responseToId: approvedWithReply.id,
      approved: true,
    },
  });

  await prisma.webmention.create({
    data: {
      approved: true,
      source: "https://johnwhiles.com/test_webmention",
      target: "https://johnwhiles.com/posts/local-fake",
      authorName: "John Whiles",
      authorUrl: "https://johnwhiles.com",
      contentText:
        "Testing my webmention endpoint. This is a reply to a post on my site.",
      authorPhoto:
        "https://webmention.io/avatar/images.ctfassets.net/5f9353e0cc1b46d438090229ac6ad5f9c36385c7b62bed4b06e3900dc4f5debf.png",
      wmProperty: "mention-of",
      raw: '{"source":"https://johnwhiles.com/test_webmention","target":"https://johnwhiles.com/posts/local-fake","private":false,"post":{"type":"entry","author":{"type":"card","name":"John Whiles","photo":"https://webmention.io/avatar/images.ctfassets.net/5f9353e0cc1b46d438090229ac6ad5f9c36385c7b62bed4b06e3900dc4f5debf.png","url":"https://johnwhles.com/"},"url":"https://johnwhiles.com/test_webmention","published":null,"wm-received":"2023-12-27T13:15:25Z","wm-id":1758846,"wm-source":"https://johnwhiles.com/test_webmention","wm-target":"https://johnwhiles.com/posts/local-fake","wm-protocol":"webmention","content":{"text":"Testing my webmention endpoint. This is a reply to a post on my site."},"mention-of":"https://johnwhiles.com/posts/local-fake","wm-property":"mention-of","wm-private":false}}',
    },
  });

  await prisma.webmention.create({
    data: {
      approved: true,
      source: "https://johnwhiles.com/test_webmention_3",
      target: "https://johnwhiles.com/posts/local-fake",
      authorName: "John Whiles",
      authorUrl: "https://johnwhiles.com",
      publishedAt: new Date("2021-01-01"),
      contentText:
        "Testing my webmention endpoint. This is a reply to a post on my site.",
      authorPhoto:
        "https://webmention.io/avatar/images.ctfassets.net/5f9353e0cc1b46d438090229ac6ad5f9c36385c7b62bed4b06e3900dc4f5debf.png",
      wmProperty: "mention-of",
      raw: "",
    },
  });

  await prisma.webmention.create({
    data: {
      approved: false,
      source: "https://johnwhiles.com/test_webmention_2",
      target: "https://johnwhiles.com/posts/local-fake",
      authorName: "John Whiles",
      authorUrl: "https://johnwhiles.com",
      contentText: "non approved",
      authorPhoto:
        "https://webmention.io/avatar/images.ctfassets.net/5f9353e0cc1b46d438090229ac6ad5f9c36385c7b62bed4b06e3900dc4f5debf.png",
      wmProperty: "mention-of",
      raw: "",
    },
  });

  await prisma.webmention.create({
    data: {
      approved: true,
      source: "https://johnwhiles.com/test_webmention_like",
      target: "https://johnwhiles.com/posts/local-fake",
      authorName: "John Whiles",
      authorUrl: "https://johnwhiles.com",
      authorPhoto:
        "https://webmention.io/avatar/images.ctfassets.net/5f9353e0cc1b46d438090229ac6ad5f9c36385c7b62bed4b06e3900dc4f5debf.png",
      wmProperty: "like-of",
      raw: "",
    },
  });
  await prisma.webmention.create({
    data: {
      approved: true,
      source: "https://johnwhiles.com/test_webmention_repost",
      target: "https://johnwhiles.com/posts/local-fake",
      authorName: "John Whiles",
      authorUrl: "https://johnwhiles.com",
      authorPhoto:
        "https://webmention.io/avatar/images.ctfassets.net/5f9353e0cc1b46d438090229ac6ad5f9c36385c7b62bed4b06e3900dc4f5debf.png",
      wmProperty: "repost-of",
      raw: "",
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

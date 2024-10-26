import { BskyAgent } from "@atproto/api";

import { config } from "~/utils/config.server";

const agent = new BskyAgent({
  service: "https://bsky.social",
});

export const makePost = async (text: string, createdAt: string) => {
  await agent.login({
    identifier: config.BLUESKY_USERNAME,
    password: config.BLUESKY_PASSWORD,
  });

  await agent.post({
    text,
    createdAt,
  });
};

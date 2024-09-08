import { AtpAgent } from "@atproto/api";
import { WhtwndBlogEntryRecord } from "../types";
import { generateRkey } from "src/utils/rkey";
import { slugify } from "src/utils/slugify";

export const addPost = async (
  post: WhtwndBlogEntryRecord,
  socialCopy: string
) => {
  const repo = process.env.ATP_IDENTIFIER!;
  const ATP_SERVICE = process.env.ATP_SERVICE!;
  const atpAgent = new AtpAgent({
    service: ATP_SERVICE,
  });
  await atpAgent.login({
    identifier: process.env.ATP_IDENTIFIER!,
    password: process.env.ATP_PASSWORD!,
  });
  const rkey = generateRkey();
  const res = await atpAgent.com.atproto.repo.createRecord({
    repo: repo,
    collection: "com.whtwnd.blog.entry",
    record: post,
    rkey: rkey,
    validate: false,
  });

  if (!res.success) {
    throw new Error("failed to add post");
  }
  if (!socialCopy) {
    socialCopy = "A new post appears!";
  }

  const socialPost = {
    $type: "app.bsky.feed.post",
    createdAt: post.createdAt,
    text: socialCopy,
    embed: {
      $type: "app.bsky.embed.external",
      external: {
        uri: `https://aparker.io/posts/${slugify(post.title)}`,
        title: post.title,
        description: "a short description",
      },
    },
  };
  console.log(socialPost);
  const socialRes = await atpAgent.com.atproto.repo.createRecord({
    repo: repo,
    collection: "app.bsky.feed.post",
    record: socialPost,
    rkey: rkey,
    validate: true,
  });
  console.log(socialRes.data);
  if (!socialRes.success) {
    throw new Error("failed to add social post");
  }

  return rkey;
};

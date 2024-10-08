import { AtpAgent } from "@atproto/api";
import { WhtwndBlogEntryRecord } from "../types";

export const deletePost = async (rkey: string) => {
  const repo = process.env.ATP_IDENTIFIER!;
  const ATP_SERVICE = process.env.ATP_SERVICE!;
  const atpAgent = new AtpAgent({
    service: ATP_SERVICE,
  });
  await atpAgent.login({
    identifier: process.env.ATP_IDENTIFIER!,
    password: process.env.ATP_PASSWORD!,
  });
  const res = await atpAgent.com.atproto.repo.deleteRecord({
    repo: repo,
    collection: "com.whtwnd.blog.entry",
    rkey: rkey,
  });

  if (!res.success) {
    throw new Error("failed to delete post");
  }

  return res.success;
};

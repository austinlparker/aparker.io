import { atpAgent } from "./agent.js";
import { WhtwndBlogEntryRecord, WhtwndBlogEntryView } from "../types";
import { whtwndBlogEntryRecordToView } from "./dataToView";
import { getCachedPost, setCachedPost } from "../redis/redis";
import { getRkeyFromTitleSlug, setTitleToRkeyMapping } from "../redis/redis";

export const getPost = async (titleSlug: string, skipCache?: boolean) => {
  const rkey = await getRkeyFromTitleSlug(titleSlug);

  if (!rkey) {
    throw new Error("Post not found");
  }

  const cachedRes = await getCachedPost(rkey);
  if (!skipCache && cachedRes) {
    return cachedRes;
  }

  const repo = process.env.ATP_IDENTIFIER!;

  const res = await atpAgent.com.atproto.repo.getRecord({
    collection: "com.whtwnd.blog.entry",
    repo,
    rkey,
  });

  if (!res.success) {
    throw new Error("Failed to get post.");
  }

  const post = whtwndBlogEntryRecordToView({
    uri: res.data.uri,
    cid: res.data.cid?.toString() ?? "",
    value: res.data.value as WhtwndBlogEntryRecord,
  }) as WhtwndBlogEntryView;

  await setCachedPost(post);
  return post;
};

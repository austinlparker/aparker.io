import Redis from "ioredis";
import { AppBskyActorDefs } from "@atproto/api";
import { WhtwndBlogEntryView } from "../types";
import { getPosts } from "../atproto";
import { slugify } from "../utils/slugify";

export const redisClient = new Redis({
  port: 6379,
  host: "127.0.0.1",
});

export const getCachedPosts = async () => {
  const res = await redisClient.get("posts");
  if (!res) {
    return null;
  }
  return JSON.parse(res) as WhtwndBlogEntryView[];
};

export const setCachedPosts = async (posts: WhtwndBlogEntryView[]) => {
  await redisClient.set("posts", JSON.stringify(posts), "EX", 60);
};

export const getCachedPost = async (rkey: string) => {
  const res = await redisClient.get(rkey);
  if (!res) {
    return null;
  }
  return JSON.parse(res) as WhtwndBlogEntryView;
};

export const setCachedPost = async (post: WhtwndBlogEntryView) => {
  await redisClient.set(post.rkey, JSON.stringify(post), "EX", 60 * 10);
};

export const getCachedProfile = async () => {
  const res = await redisClient.get("profile");
  if (!res) {
    return null;
  }
  return JSON.parse(res) as AppBskyActorDefs.ProfileViewDetailed;
};

export const setCachedProfile = async (
  profile: AppBskyActorDefs.ProfileViewDetailed
) => {
  await redisClient.set("profile", JSON.stringify(profile), "EX", 60 * 10);
};

export const setTitleToRkeyMapping = async (
  titleSlug: string,
  rkey: string
) => {
  await redisClient
    .multi()
    .set(`title:${titleSlug}`, rkey)
    .set(`rkey:${rkey}`, titleSlug)
    .exec();
};

export const setRkeyToTitleMapping = async (
  rkey: string,
  titleSlug: string
) => {
  await redisClient.set(`rkey:${rkey}`, titleSlug);
};

export const getRkeyFromTitleSlug = async (titleSlug: string) => {
  return await redisClient.get(`title:${titleSlug}`);
};

export const getTitleSlugFromRkey = async (rkey: string) => {
  return await redisClient.get(`rkey:${rkey}`);
};

export const removeTitleRkeyMappings = async (
  titleSlug: string,
  rkey: string
) => {
  await redisClient
    .multi()
    .del(`title:${titleSlug}`)
    .del(`rkey:${rkey}`)
    .exec();
};

export const initializeTitleRkeyMappings = async () => {
  console.log("Initializing title-rkey mappings...");
  const posts = await getPosts(undefined);

  const pipeline = redisClient.pipeline();

  for (const post of posts) {
    const titleSlug = slugify(post.title);
    pipeline.set(`title:${titleSlug}`, post.rkey);
    pipeline.set(`rkey:${post.rkey}`, titleSlug);
  }

  await pipeline.exec();
  console.log(`Initialized mappings for ${posts.length} posts.`);
};

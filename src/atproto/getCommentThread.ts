import {
  AtpAgent,
  AppBskyFeedDefs,
  AppBskyFeedGetPostThread,
} from "@atproto/api";

function cleanThreadReplies(
  thread: AppBskyFeedDefs.ThreadViewPost
): AppBskyFeedDefs.ThreadViewPost {
  return {
    ...thread,
    replies:
      thread.replies
        ?.filter(AppBskyFeedDefs.isThreadViewPost)
        .map(cleanThreadReplies) || [],
  };
}

export const getCommentThread = async (
  rkey: string
): Promise<AppBskyFeedDefs.ThreadViewPost> => {
  const ATP_SERVICE = process.env.ATP_SERVICE!;
  const atpAgent = new AtpAgent({ service: ATP_SERVICE });
  await atpAgent.login({
    identifier: process.env.ATP_IDENTIFIER!,
    password: process.env.ATP_PASSWORD!,
  });

  const result = await atpAgent.getPostThread({
    uri: `at://${process.env.ATP_IDENTIFIER}/app.bsky.feed.post/${rkey}`,
    depth: 100, // Increase depth to get more nested replies
  });

  if (!result.success) {
    throw new Error("Failed to fetch post thread");
  }

  if (!AppBskyFeedDefs.isThreadViewPost(result.data.thread)) {
    throw new Error("Unexpected thread structure");
  }

  const cleanedThread = cleanThreadReplies(result.data.thread);

  return cleanedThread;
};

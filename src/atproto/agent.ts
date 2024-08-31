import { AtpAgent } from "@atproto/api";

const ATP_SERVICE = process.env.ATP_SERVICE!;
export const atpAgent = new AtpAgent({
  service: ATP_SERVICE,
});
export const bskyAgent = new AtpAgent({
  service: "https://public.api.bsky.app/",
});

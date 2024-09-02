import { AtpAgent } from "@atproto/api";

export const getBlob = async (cid: string) => {
  const ATP_SERVICE = process.env.ATP_SERVICE!;
  const atpAgent = new AtpAgent({
    service: ATP_SERVICE,
  });
  await atpAgent.login({
    identifier: process.env.ATP_IDENTIFIER!,
    password: process.env.ATP_PASSWORD!,
  });

  const res = await atpAgent.com.atproto.sync.getBlob({
    did: process.env.ATP_DID!,
    cid: cid,
  });

  if (!res.success) {
    throw new Error("failed to add post");
  }

  return res;
};

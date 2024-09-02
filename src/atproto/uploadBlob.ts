import { AtpAgent } from "@atproto/api";

export const uploadBlob = async (dataURI: string) => {
  const ATP_SERVICE = process.env.ATP_SERVICE!;
  const atpAgent = new AtpAgent({
    service: ATP_SERVICE,
  });
  await atpAgent.login({
    identifier: process.env.ATP_IDENTIFIER!,
    password: process.env.ATP_PASSWORD!,
  });

  const imageArray = new Uint8Array(
    Buffer.from(dataURI.split(",")[1], "base64")
  );
  const res = await atpAgent.uploadBlob(imageArray);

  if (!res.success) {
    throw new Error("failed to add post");
  }

  return res.data.blob;
};

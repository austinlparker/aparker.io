import { AtpAgent } from "@atproto/api";
import { PostImage } from "src/types";
import { generateRkey } from "src/utils/rkey";

export const uploadBlob = async (dataURI: string) => {
  const ATP_SERVICE = process.env.ATP_SERVICE!;
  const repo = process.env.ATP_IDENTIFIER!;
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
  console.log(res.data.blob);
  const post: PostImage = {
    $type: "com.aparker.blog.image",
    image: {
      $type: "blob",
      ref: res.data.blob.ref,
      mimeType: res.data.blob.mimeType,
      size: res.data.blob.size,
    },
  };
  console.log(post);
  const record = await atpAgent.com.atproto.repo.createRecord({
    repo: repo,
    collection: "com.aparker.blog.image",
    record: post,
    rkey: generateRkey(),
    validate: false,
  });

  if (!record.success) {
    throw new Error("failed to add record");
  }
  return record.data;
};

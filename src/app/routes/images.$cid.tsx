import type { LoaderFunctionArgs } from "@remix-run/node";
import { getBlob } from "src/atproto";

export async function loader({ params }: LoaderFunctionArgs) {
  const { cid } = params;
  const blob = await getBlob(cid!);
  const contentType = blob.headers["content-type"];
  return new Response(blob.data, {
    headers: {
      "Content-Type": contentType,
    },
  });
}

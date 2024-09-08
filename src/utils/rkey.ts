import { TID } from "@atproto/common";

export function generateRkey(): string {
  return TID.nextStr();
}

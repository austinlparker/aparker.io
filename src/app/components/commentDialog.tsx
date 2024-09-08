import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { AppBskyFeedDefs } from "@atproto/api";

interface CommentDialogProps {
  comments: (
    | AppBskyFeedDefs.ThreadViewPost
    | AppBskyFeedDefs.NotFoundPost
    | AppBskyFeedDefs.BlockedPost
  )[];
}

function CommentItem({ comment }: { comment: AppBskyFeedDefs.ThreadViewPost }) {
  return (
    <li className="py-1 px-1">
      <div className="flex items-start space-x-1">
        <img
          src={comment.post.author.avatar || "/default-avatar.png"}
          alt={`${
            comment.post.author.displayName || comment.post.author.handle
          }'s avatar`}
          className="w-6 h-6 rounded-full"
        />
        <div className="flex-1 text-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="font-semibold">
                {comment.post.author.displayName || comment.post.author.handle}
              </span>
              <span className="text-gray-500 ml-1">
                @{comment.post.author.handle}
              </span>
            </div>
            <span className="text-xxs text-gray-500">
              {new Date(comment.post.indexedAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-0.5">{comment.post.record.text}</p>
          {comment.replies && comment.replies.length > 0 && (
            <ul className="mt-1 pl-2 border-l border-gray-200">
              {comment.replies
                .filter(AppBskyFeedDefs.isThreadViewPost)
                .map((reply) => (
                  <CommentItem key={reply.post.cid} comment={reply} />
                ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

export function CommentDialog({ comments }: CommentDialogProps) {
  return (
    <div className="window">
      <div className="title-bar">
        <button aria-label="Close" className="close"></button>
        <h2 className="title flex items-center">Comments</h2>
        <button aria-label="Resize" className="resize"></button>
      </div>
      <div className="window-pane overflow-y-auto max-h-[60vh] p-1">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center">No comments yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {comments
              .filter(AppBskyFeedDefs.isThreadViewPost)
              .map((comment) => (
                <CommentItem key={comment.post.cid} comment={comment} />
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

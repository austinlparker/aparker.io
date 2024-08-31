import React from "react";
import { json, MetaFunction } from "@remix-run/node";
import { getPosts, getProfile } from "../../atproto";
import { setTitleToRkeyMapping } from "../../redis/redis";
import { useLoaderData } from "@remix-run/react";
import { WhtwndBlogEntryView } from "../../types";
import { AppBskyActorDefs } from "@atproto/api";
import { slugify } from "../../utils/slugify";
import Markdown from "react-markdown";

export const loader = async () => {
  const posts = await getPosts(undefined);
  const profile = await getProfile();

  const postsFiltered = posts.filter((p) => !p.content?.startsWith("NOT_LIVE"));

  const postsShortened = postsFiltered.map((p) => {
    // Create the mapping for each post
    const titleSlug = slugify(p.title);
    setTitleToRkeyMapping(titleSlug, p.rkey);

    // Shorten the content
    p.content = p.content?.slice(0, 300);
    return p;
  });

  return json({ posts: postsShortened, profile });
};

export const meta: MetaFunction = () => {
  return [
    { title: "aparker.io" },
    {
      name: "description",
      content: "austin's personal blog.",
    },
  ];
};

export default function Index() {
  const { posts, profile } = useLoaderData<{
    posts: WhtwndBlogEntryView[];
    profile: AppBskyActorDefs.ProfileViewDetailed;
  }>();

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-8">
        <div className="standard-dialog md:w-1/3 order-last md:order-first">
          {profile ? (
            <img
              className="rounded-full w-32 h-32"
              src={profile.avatar}
              alt="austin's avatar"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
          )}
          <h1 className="dialog-text">aparker.io</h1>
          <p className="dialog-text">welcome!</p>
        </div>
        <div className="flex flex-col gap-4 window md:w-2/3 order-first md:order-last">
          <div className="title-bar">
            <button aria-label="Close" className="close"></button>
            <h1 className="title">blog posts</h1>
            <button aria-label="Resize" className="resize"></button>
          </div>
          <div className="separator"></div>
          <div className="window-pane">
            <ul className="list-none">
              {posts
                ?.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((post) => (
                  <PostItem post={post} key={post.rkey} />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostItem({ post }: { post: WhtwndBlogEntryView }) {
  const titleSlug = slugify(post.title);

  return (
    <li>
      <div className="flex">
        <p>
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })}
          &nbsp;&nbsp;&mdash;&nbsp;&nbsp;
        </p>
        <a className="font-bold hover:underline" href={`/posts/${titleSlug}`}>
          <h3 className="text-xl"> {post.title}</h3>
        </a>
      </div>
    </li>
  );
}

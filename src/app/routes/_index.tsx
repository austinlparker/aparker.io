import React from "react";
import { json, MetaFunction } from "@remix-run/node";
import { getPosts, getProfile } from "../../atproto";
import { setTitleToRkeyMapping } from "../../redis/redis";
import { useLoaderData } from "@remix-run/react";
import { WhtwndBlogEntryView } from "../../types";
import { AppBskyActorDefs } from "@atproto/api";
import { slugify } from "../../utils/slugify";
import { Sidebar } from "../components/sidebar";
import Markdown from "react-markdown";

type LoaderData = {
  posts: WhtwndBlogEntryView[];
  profile: {
    avatar?: string;
    displayName?: string;
    [key: string]: any; // This allows for other properties
  };
};

export const loader = async () => {
  const posts = await getPosts(undefined);
  const profile = await getProfile();

  const postsFiltered = posts.filter((p) => !p.content?.startsWith("NOT_LIVE"));

  const postsShortened = postsFiltered.map((p) => {
    p.content = p.content?.slice(0, 300);
    return p;
  });

  return json<LoaderData>({ posts: postsShortened, profile });
};

export const meta: MetaFunction = () => {
  return [
    { title: "aparker.io" },
    {
      name: "description",
      content: "austin's personal blog.",
    },
    { name: "og:image", content: "/og/og-image.jpeg" },
  ];
};

export default function Index() {
  const { posts, profile } = useLoaderData<{
    posts: WhtwndBlogEntryView[];
    profile: AppBskyActorDefs.ProfileViewDetailed;
  }>();

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 md:pt-8 overflow-hidden">
        <div className="md:col-span-1">
          <Sidebar profile={profile} />
        </div>
        <div className="md:col-span-2 flex flex-col overflow-hidden">
          <div className="window flex-1 flex flex-col">
            <div className="title-bar">
              <button aria-label="Close" className="close"></button>
              <h1 className="title">blog posts</h1>
              <button aria-label="Resize" className="resize"></button>
            </div>
            <div className="separator"></div>
            <div className="window-pane flex-1 overflow-y-auto">
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
    </div>
  );
}

function PostItem({ post }: { post: WhtwndBlogEntryView }) {
  const titleSlug = slugify(post.title);

  return (
    <li className="mb-4">
      <div className="flex flex-col">
        <a className="font-bold hover:underline" href={`/posts/${titleSlug}`}>
          <h3 className="text-xl">{post.title}</h3>
        </a>
        <p className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <Markdown className="mt-2 text-sm">{post.content}</Markdown>
      </div>
    </li>
  );
}

import React from "react";
import { useLoaderData } from "@remix-run/react";
import Markdown, { Components } from "react-markdown";
import { WhtwndBlogEntryView } from "../../types";
import { getPost, getProfile, getPosts } from "../../atproto";
import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { NavigationDialog } from "../components/navigationDialog";
import { Sidebar } from "../components/sidebar";
import { AppBskyActorDefs } from "@atproto/api";
import { Link } from "../components/link";
import { getRkeyFromTitleSlug, getTitleSlugFromRkey } from "src/redis/redis";
import { slugify } from "src/utils/slugify";

type LoaderData = {
  post: WhtwndBlogEntryView;
  profile: {
    avatar?: string;
    displayName?: string;
    [key: string]: any;
  };
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { titleSlug } = params;
  const rkey = await getRkeyFromTitleSlug(titleSlug!);

  if (!rkey) {
    throw new Response("Not Found", { status: 404 });
  }

  const post = await getPost(titleSlug!);
  const profile = await getProfile();

  // Fetch all posts to determine previous and next
  const allPosts = await getPosts(undefined);
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const currentIndex = sortedPosts.findIndex((p) => p.rkey === rkey);

  let previousPost, nextPost;

  if (currentIndex < sortedPosts.length - 1) {
    const previousRkey = sortedPosts[currentIndex + 1].rkey;
    const previousTitleSlug =
      (await getTitleSlugFromRkey(previousRkey)) ||
      slugify(sortedPosts[currentIndex + 1].title);
    previousPost = `/posts/${previousTitleSlug}`;
  }

  if (currentIndex > 0) {
    const nextRkey = sortedPosts[currentIndex - 1].rkey;
    const nextTitleSlug =
      (await getTitleSlugFromRkey(nextRkey)) ||
      slugify(sortedPosts[currentIndex - 1].title);
    nextPost = `/posts/${nextTitleSlug}`;
  }

  return json({ post, profile, previousPost, nextPost });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `${data?.post.title} | aparker.io` },
    {
      name: "description",
      content: `${data?.post.content?.split(" ").slice(0, 100).join(" ")}...`,
    },
    {
      name: "og:title",
      content: `${data?.post.title}`,
    },
    {
      name: "og:description",
      content: `${data?.post.content?.split(" ").slice(0, 100).join(" ")}...`,
    },
    ...(data?.post.banner && data?.post.banner !== ""
      ? [
          {
            name: "og:image",
            content: `${data?.post.banner}`,
          },
        ]
      : []),
  ];
};
export default function Posts() {
  const { post, profile, previousPost, nextPost } = useLoaderData<{
    post: WhtwndBlogEntryView;
    profile: AppBskyActorDefs.ProfileViewDetailed;
    previousPost?: string;
    nextPost?: string;
  }>();

  if (!post) {
    return <Error />;
  }

  const postDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-8 items-start">
        <Sidebar profile={profile} />
        <div className="flex flex-col gap-4 md:w-2/3 order-first md:order-last">
          <div className="window">
            <div className="title-bar">
              <button aria-label="Close" className="close"></button>
              <h1 className="title">{post.title}</h1>
              <button aria-label="Resize" className="resize"></button>
            </div>
            <div className="details-bar">
              <span>{postDate}</span>
            </div>
            <div className="window-pane">
              <Markdown components={markdownComponents} className="break-words">
                {post.content}
              </Markdown>
            </div>
          </div>
          <NavigationDialog previousPost={previousPost} nextPost={nextPost} />
        </div>
      </div>
    </div>
  );
}

function Error() {
  return (
    <div className="container mx-auto pt-10 md:pt-20 pb-20">
      <div className="standard-dialog">
        <h1 className="dialog-text text-2xl font-bold">
          Uh...something went wrong.
        </h1>
        <div className="p-4">
          <img
            src="/monkey.jpg"
            alt="Monkey muppet meme image"
            className="rounded-md"
          />
        </div>
        <Link href="/">Return home</Link>
      </div>
    </div>
  );
}

const markdownComponents: Partial<Components> = {
  h1: ({ children }) => (
    <>
      <h1 className="text-3xl md:text-4xl font-bold">{children}</h1>
      <div className="w-full h-0.5 bg-gray my-2"></div>
    </>
  ),
  h2: ({ children }) => (
    <>
      <h2 className="text-2xl md:text-3xl font-bold pt-6">{children}</h2>
      <div className="w-full h-0.5 bg-gray my-2"></div>
    </>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-bold pt-4">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-lg md:text-xl font-bold pt-4">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-base md:text-lg font-bold pt-4">{children}</h5>
  ),
  p: ({ children }) => <p className="py-2 text-lg">{children}</p>,
  a: ({ children, href }) => <Link href={href as string}>{children}</Link>,
  ul: ({ children }) => <ul className="list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="py-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-300 my-3 pl-4 py-1">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-gray p-1 rounded-md">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray p-2 rounded-md overflow-x-auto my-4">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => (
    <div className="flex justify-center p-6">
      <img src={src as string} alt={alt as string} className="rounded-md" />
    </div>
  ),
  hr: () => <hr className="my-4" />,
  table: ({ children }) => (
    <table className="table-auto w-full">{children}</table>
  ),
  thead: ({ children }) => <thead className="bg-100">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th className="border border-300 p-2">{children}</th>,
  td: ({ children }) => <td className="border border-300 p-2">{children}</td>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del>{children}</del>,
  br: () => <br />,
};

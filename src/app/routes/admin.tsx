import { useState } from "react";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { addPost, getPosts, deletePost } from "../../atproto";
import type { WhtwndBlogEntryRecord, WhtwndBlogEntryView } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getTitleSlugFromRkey,
  removeTitleRkeyMappings,
  setTitleToRkeyMapping,
} from "src/redis/redis";
import { slugify } from "src/utils/slugify";

export const loader: LoaderFunction = async () => {
  const posts = await getPosts(undefined);
  return json({ posts });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "add") {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title || !content) {
      return json({ error: "Title and content are required" }, { status: 400 });
    }

    try {
      const post: WhtwndBlogEntryRecord = {
        $type: "com.whtwnd.blog.entry",
        content,
        title,
        createdAt: new Date().toISOString(),
      };
      const rkey = await addPost(post);
      const titleSlug = slugify(title);
      await setTitleToRkeyMapping(titleSlug, rkey);
      return redirect("/admin");
    } catch (error) {
      console.error("Error adding post:", error);
      return json(
        { error: "Failed to add post. Please try again." },
        { status: 500 }
      );
    }
  } else if (action === "delete") {
    const rkey = formData.get("rkey") as string;
    try {
      const titleSlug = await getTitleSlugFromRkey(rkey);
      if (!titleSlug) {
        throw new Error(`No title slug found for rkey: ${rkey}`);
      }

      await deletePost(rkey);
      await removeTitleRkeyMappings(titleSlug, rkey);

      return redirect("/admin");
    } catch (error) {
      console.error("Error deleting post:", error);
      return json(
        { error: "Failed to delete post. Please try again." },
        { status: 500 }
      );
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function AdminPage() {
  const { posts } = useLoaderData<{ posts: WhtwndBlogEntryView[] }>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-8">
        <div className="window md:w-2/3 mx-auto">
          <div className="title-bar">
            <button aria-label="Close" className="close"></button>
            <h1 className="title">Admin Dashboard</h1>
            <button aria-label="Resize" className="resize"></button>
          </div>
          <div className="separator"></div>
          <div className="window-pane p-4">
            <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
            <Form method="post" className="flex flex-col gap-4">
              <input type="hidden" name="action" value="add" />
              <div>
                <label htmlFor="title" className="block mb-2">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="content" className="block mb-2">
                  Content:
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full p-2 border rounded h-40"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isSubmitting ? "Adding..." : "Add Post"}
              </button>
            </Form>
            {actionData?.error && (
              <p className="text-red-500 mt-4">{actionData.error}</p>
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4">Existing Posts</h2>
            <ul className="space-y-4">
              {posts.map((post) => (
                <li
                  key={post.rkey}
                  className="flex justify-between items-center"
                >
                  <span>{post.title}</span>
                  <Form method="post">
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="rkey" value={post.rkey} />
                    <button
                      type="submit"
                      className="text-red-500 hover:text-red-700"
                      title="Delete post"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </Form>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

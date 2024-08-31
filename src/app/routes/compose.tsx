import { useState } from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { addPost } from "../../atproto";
import type { WhtwndBlogEntryRecord } from "../../types";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
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
    await addPost(post);
    return redirect("/"); // Redirect to home page or post list
  } catch (error) {
    console.error("Error adding post:", error);
    return json(
      { error: "Failed to add post. Please try again." },
      { status: 500 }
    );
  }
};

export default function AddPostPage() {
  const actionData = useActionData<typeof action>();
  const transition = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isSubmitting = transition.state === "submitting";

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row gap-4 pt-4 md:pt-8">
        <div className="window md:w-2/3 mx-auto">
          <div className="title-bar">
            <button aria-label="Close" className="close"></button>
            <h1 className="title">Add New Post</h1>
            <button aria-label="Resize" className="resize"></button>
          </div>
          <div className="separator"></div>
          <div className="window-pane p-4">
            <Form method="post" className="flex flex-col gap-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { authenticator } from "../services/session.server";
import {
  Form,
  useActionData,
  useNavigation,
  useLoaderData,
} from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  addPost,
  getPosts,
  deletePost,
  listBlobs,
  uploadBlob,
} from "../../atproto";
import type { WhtwndBlogEntryRecord, WhtwndBlogEntryView } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getTitleSlugFromRkey,
  removeTitleRkeyMappings,
  setTitleToRkeyMapping,
} from "src/redis/redis";
import { slugify } from "src/utils/slugify";

const ATP_SERVICE = process.env.ATP_SERVICE!;
const ATP_IDENTIFIER = process.env.ATP_DID!;

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const posts = await getPosts(undefined);
  const blobs = await listBlobs();
  return json({ posts, blobs, ATP_SERVICE, ATP_IDENTIFIER });
};

export const action: ActionFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "upload") {
    const image = formData.get("image") as File;
    if (!image) {
      return json({ error: "No image provided" }, { status: 400 });
    }

    try {
      const arrayBuffer = await image.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataURI = `data:${image.type};base64,${base64}`;

      await uploadBlob(dataURI);
      return redirect("/admin");
    } catch (error) {
      console.error("Error uploading image:", error);
      return json(
        { error: "Failed to upload image. Please try again." },
        { status: 500 },
      );
    }
  }

  if (action === "add") {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const createdAt = formData.get("createdAt") as string;
    const socialCopy = formData.get("socialCopy") as string;

    if (!title || !content || !createdAt) {
      return json(
        { error: "Title, content, and creation date are required" },
        { status: 400 },
      );
    }

    try {
      const post: WhtwndBlogEntryRecord = {
        $type: "com.whtwnd.blog.entry",
        content,
        title,
        createdAt: new Date(createdAt).toISOString(),
      };
      const rkey = await addPost(post, socialCopy);
      const titleSlug = slugify(title);
      await setTitleToRkeyMapping(titleSlug, rkey);
      return redirect("/admin");
    } catch (error) {
      console.error("Error adding post:", error);
      return json(
        { error: "Failed to add post. Please try again." },
        { status: 500 },
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
        { status: 500 },
      );
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export default function AdminPage() {
  const { posts, blobs, ATP_SERVICE, ATP_IDENTIFIER } = useLoaderData<{
    posts: WhtwndBlogEntryView[];
    blobs: string[];
    ATP_SERVICE: string;
    ATP_IDENTIFIER: string;
  }>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const [createdAt, setCreatedAt] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  const isSubmitting = navigation.state === "submitting";

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("image") as File;

    if (file) {
      setUploadStatus("Uploading...");
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataURI = e.target?.result as string;
          await uploadBlob(dataURI);
          setUploadStatus("Upload successful!");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadStatus("Upload failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="window mb-8">
          <div className="title-bar">
            <button aria-label="Close" className="close"></button>
            <h1 className="title">Add New Post</h1>
            <button aria-label="Resize" className="resize"></button>
          </div>
          <div className="separator"></div>
          <div className="window-pane p-4">
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
                  className="w-full p-2 border-2 border-gray-300 rounded"
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
                  className="w-full p-2 border-2 border-gray-300 rounded h-40 resize-y"
                />
              </div>
              <div>
                <label htmlFor="createdAt" className="block mb-2">
                  Creation Date:
                </label>
                <input
                  type="datetime-local"
                  id="createdAt"
                  name="createdAt"
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="socialCopy" className="block mb-2">
                  Social Copy:
                </label>
                <input
                  type="textarea"
                  id="socialCopy"
                  name="socialCopy"
                  required
                  className="w-full p-2 border-2 border-gray-300 rounded"
                />
              </div>
              <button type="submit" disabled={isSubmitting} className="btn">
                {isSubmitting ? "Adding..." : "Add Post"}
              </button>
            </Form>
            {actionData?.error && (
              <p className="text-red-500 mt-4">{actionData.error}</p>
            )}
          </div>
        </div>

        <div className="window mb-8">
          <div className="title-bar">
            <button aria-label="Close" className="close"></button>
            <h1 className="title">Upload Image</h1>
            <button aria-label="Resize" className="resize"></button>
          </div>
          <div className="separator"></div>
          <div className="window-pane p-4">
            <Form onSubmit={handleUpload} encType="multipart/form-data">
              <input type="file" name="image" accept="image/*" required />
              <button type="submit" className="btn mt-2">
                Upload Image
              </button>
            </Form>
            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
          </div>
        </div>

        <div className="window mb-8">
          <div className="title-bar">
            <button aria-label="Close" className="close"></button>
            <h1 className="title">Existing Posts</h1>
            <button aria-label="Resize" className="resize"></button>
          </div>
          <div className="separator"></div>
          <div className="window-pane p-4">
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
                      className="btn btn-danger"
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

        <div className="window">
          <div className="title-bar">
            <button aria-label="Close" className="close"></button>
            <h1 className="title">Available Blobs</h1>
            <button aria-label="Resize" className="resize"></button>
          </div>
          <div className="separator"></div>
          <div className="window-pane p-4">
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blobs.map((blob) => (
                <li key={blob} className="border rounded p-4">
                  <div className="aspect-w-16 aspect-h-9 mb-2">
                    <img
                      src={`${ATP_SERVICE}/xrpc/com.atproto.sync.getBlob?did=${ATP_IDENTIFIER}&cid=${blob}`}
                      alt="Blob preview"
                      className="object-cover w-full h-full rounded"
                    />
                  </div>
                  <div className="text-sm break-all">
                    <strong>CID:</strong> {blob}
                  </div>
                  <div className="text-sm break-all">
                    <strong>URL:</strong>{" "}
                    <a
                      href={`${ATP_SERVICE}/xrpc/com.atproto.sync.getBlob?did=${ATP_IDENTIFIER}&cid=${blob}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Full Image
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

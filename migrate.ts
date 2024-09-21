import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { addPost, uploadBlob } from "./src/atproto";
import { setTitleToRkeyMapping } from "./src/redis/redis";
import { slugify } from "./src/utils/slugify";
import { WhtwndBlogEntryRecord } from "./src/types";

async function convertPost(inputFile: string): Promise<void> {
  // Read the input file
  const content = fs.readFileSync(inputFile, "utf-8");

  // Parse frontmatter and content
  const { data, content: postContent } = matter(content);

  // Extract metadata
  const title = data.title || "";
  const dateStr = data.date || "";
  const categories = data.categories || [];
  const tags = data.tags || [];

  // Convert date string to Date object
  const createdAt = new Date(dateStr).toISOString();

  // Prepare post content
  let newContent = postContent;

  // Replace image links
  const imageRegex = /!\[([^\]]*)\]\(images\/([^\)]+)\)/g;
  const imageMatches = newContent.match(imageRegex) || [];

  for (const match of imageMatches) {
    const [, alt, imagePath] =
      match.match(/!\[([^\]]*)\]\(images\/([^\)]+)\)/) || [];
    const fullImagePath = path.join(
      path.dirname(inputFile),
      "images",
      imagePath,
    );

    if (fs.existsSync(fullImagePath)) {
      try {
        const imageContent = fs.readFileSync(fullImagePath);
        const dataURI = `data:image/png;base64,${imageContent.toString("base64")}`;

        const cid = await uploadBlob(dataURI);
        const newImageLink = `![${alt}](${process.env.ATP_SERVICE}/xrpc/com.atproto.sync.getBlob?did=${process.env.ATP_DID}&cid=${cid})`;

        newContent = newContent.replace(match, newImageLink);
      } catch (error) {
        console.warn(
          `Failed to process image ${fullImagePath}: ${error.message}`,
        );
        // Keep the original image link if upload fails
      }
    } else {
      console.warn(`Image not found: ${fullImagePath}`);
      // Keep the original image link if the file doesn't exist
    }
  }

  // Create post object
  const post: WhtwndBlogEntryRecord = {
    $type: "com.whtwnd.blog.entry" as const,
    content: newContent,
    title,
    createdAt,
  };

  console.log(`Converted and added: ${inputFile}`);
}

async function main() {
  const inputDir = "output"; // Directory containing your existing markdown files

  // Process each markdown file in the input directory
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    if (file.endsWith(".md")) {
      const inputPath = path.join(inputDir, file);
      await convertPost(inputPath);
    }
  }
}

main().catch(console.error);

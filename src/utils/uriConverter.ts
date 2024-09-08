export function atUriToHttps(atUri: string): string {
  try {
    // Regular expression to match the AT URI format
    const regex = /at:\/\/([^/]+)\/([^/]+)\/([^/]+)/;
    const match = atUri.match(regex);

    if (!match) {
      throw new Error("Invalid AT URI format");
    }

    const [, did, collection, rkey] = match;

    // Check if the collection is 'app.bsky.feed.post'
    if (collection !== "app.bsky.feed.post") {
      throw new Error("Unsupported collection type");
    }

    // Construct the HTTPS URL
    return `https://bsky.app/profile/${did}/post/${rkey}`;
  } catch (error) {
    console.error("Error converting AT URI to HTTPS:", error);
    return ""; // Return an empty string or handle the error as needed
  }
}

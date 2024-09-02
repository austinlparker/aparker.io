import { json } from "@remix-run/react";
import { isOpenGraphImageRequest } from "remix-og-image";

// 👉 1. Export the special `openGraphImage` function.
// This function returns an array of OG image generation entries.
// In the example below, it generates only one image called "og-image.jpeg"
export function openGraphImage() {
  return [
    // The `name` property controls the generated
    // image's file name.
    { name: "og-image" },
  ];
}

// 2a. Add the `loader` export.
export function loader({ request }) {
  // 👉 2b. First, check if the incoming request is a meta request
  // from the plugin. Use the `isOpenGraphImageRequest` utility from the library.
  if (isOpenGraphImageRequest(request)) {
    /**
     * @note Throw the OG image response instead of returning it.
     * This way, you don't have to deal with the `loader` function
     * returning a union of OG image data and the actual data
     * returned to the UI component.
     */
    throw json(openGraphImage());
  }

  // Compute and return any data needed for the OG image.
  // In this case, this is a static route.
  return null;
}

// 👉 3. Create a React component for your OG image.
// Use whichever other components, styles, utilities, etc.
// your app already has. No limits!
export default function Template() {
  return (
    <div className="w-[1200px] h-[630px] flex justify-center items-center bg-gray-100">
      <div
        id="og-image"
        className="alert-box outer-border w-4/5 max-w-[1000px]"
      >
        <div className="inner-border">
          <div className="alert-contents p-6">
            <div className="flex items-center mb-4">
              <img
                src="/bomb.webp"
                alt="Error"
                className="w-8 h-8 mr-3 flex-shrink-0"
              />
              <h1 className="alert-text text-2xl font-bold">
                another fine blog post on aparker.io
              </h1>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="btn px-4 py-2">Read More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

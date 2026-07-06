import { getStore } from "@netlify/blobs";

// Public, unauthenticated: serves the approved reviews shown on the live page.
export default async () => {
  const store = getStore("reviews");
  const approved = (await store.get("approved", { type: "json" })) || [];

  return new Response(JSON.stringify(approved), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
    },
  });
};

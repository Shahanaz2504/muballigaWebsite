import { getStore } from "@netlify/blobs";

// Public, unauthenticated: serves the reviews shown on the live page.
// Each review is its own blob, keyed by id — deleting a spam entry from the
// Blobs page in the Netlify dashboard removes it here on the next request.
export default async () => {
  const store = getStore("reviews");
  const { blobs } = await store.list();

  const reviews = (
    await Promise.all(blobs.map(({ key }) => store.get(key, { type: "json" })))
  ).filter(Boolean);

  reviews.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  return new Response(JSON.stringify(reviews), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};

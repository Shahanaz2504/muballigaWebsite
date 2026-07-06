import { getStore } from "@netlify/blobs";

// Netlify invokes this automatically whenever any Netlify Form on the site
// receives a submission — https://docs.netlify.com/build/functions/trigger-on-events/
export default async (req) => {
  const { payload } = await req.json();

  if (!payload || payload.form_name !== "student-review") {
    return new Response(null, { status: 200 });
  }

  const data = payload.data || {};
  const rating = Math.max(1, Math.min(5, Number(data.rating) || 0));

  const review = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: String(data.name || "").slice(0, 120),
    rating,
    text: String(data.review || "").slice(0, 2000),
    submittedAt: new Date().toISOString(),
  };

  // One blob per review (keyed by id) so a single spam entry can be deleted
  // individually from the Blobs page in the Netlify dashboard.
  const store = getStore("reviews");
  await store.setJSON(review.id, review);

  return new Response(null, { status: 200 });
};

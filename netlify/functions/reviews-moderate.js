const { getStore } = require("@netlify/blobs");

// Identity-protected: approves or rejects a pending review from the admin page.
// Approving moves it into the public "approved" list; rejecting just drops it.
exports.handler = async (event, context) => {
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: "Bad Request" };
  }

  const { id, action } = payload;
  if (!id || (action !== "approve" && action !== "reject")) {
    return { statusCode: 400, body: "Bad Request" };
  }

  const store = getStore("reviews");
  const pending = (await store.get("pending", { type: "json" })) || [];
  const index = pending.findIndex((review) => review.id === id);
  if (index === -1) {
    return { statusCode: 404, body: "Not found" };
  }

  const [review] = pending.splice(index, 1);
  await store.setJSON("pending", pending);

  if (action === "approve") {
    const approved = (await store.get("approved", { type: "json" })) || [];
    approved.unshift({ ...review, approvedAt: new Date().toISOString() });
    await store.setJSON("approved", approved);
  }

  return { statusCode: 200, body: "ok" };
};

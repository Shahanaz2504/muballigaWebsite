const { getStore } = require("@netlify/blobs");

// Identity-protected: lists reviews awaiting moderation for the admin page.
exports.handler = async (event, context) => {
  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  const store = getStore("reviews");
  const pending = (await store.get("pending", { type: "json" })) || [];

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pending),
  };
};

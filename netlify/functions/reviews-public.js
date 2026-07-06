const { getStore } = require("@netlify/blobs");

// Public, unauthenticated: serves the approved reviews shown on the live page.
exports.handler = async () => {
  const store = getStore("reviews");
  const approved = (await store.get("approved", { type: "json" })) || [];

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
    },
    body: JSON.stringify(approved),
  };
};

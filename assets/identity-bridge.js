(function () {
  "use strict";
  if (!window.netlifyIdentity) return;

  // Invite/confirmation/recovery emails link to the site root, not the admin
  // page. Loading the widget here lets it catch the token in the URL and pop
  // up the right modal (e.g. "set your password"), then send you on to the
  // admin page once you're actually logged in.
  window.netlifyIdentity.on("login", function () {
    window.location.href = "/admin/reviews.html";
  });

  window.netlifyIdentity.init();
})();

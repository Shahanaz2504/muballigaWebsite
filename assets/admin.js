(function () {
  "use strict";

  var loginGate = document.getElementById("login-gate");
  var adminPanel = document.getElementById("admin-panel");
  var adminAccount = document.getElementById("admin-account");
  var loginBtn = document.getElementById("login-btn");
  var refreshBtn = document.getElementById("refresh-btn");
  var statusEl = document.getElementById("admin-status");
  var pendingList = document.getElementById("pending-list");
  var emptyState = document.getElementById("empty-state");

  function setStatus(message) {
    statusEl.textContent = message || "";
  }

  function renderAccount(user) {
    adminAccount.innerHTML = "";
    if (!user) return;

    var label = document.createElement("span");
    label.textContent = user.email + " ";
    label.style.color = "var(--ink-500)";
    label.style.fontSize = "0.85rem";
    label.style.marginRight = "0.8rem";

    var logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className = "btn btn--ghost";
    logoutBtn.textContent = "Log Out";
    logoutBtn.addEventListener("click", function () {
      window.netlifyIdentity.logout();
    });

    adminAccount.append(label, logoutBtn);
  }

  function renderPending(reviews) {
    pendingList.innerHTML = "";

    if (!reviews.length) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    reviews.forEach(function (review) {
      var card = document.createElement("div");
      card.className = "pending-card";

      var head = document.createElement("div");
      head.className = "pending-card-head";

      var nameEl = document.createElement("strong");
      nameEl.textContent = review.name || "Anonymous";

      var timeEl = document.createElement("time");
      timeEl.textContent = review.submittedAt
        ? new Date(review.submittedAt).toLocaleString()
        : "";

      head.append(nameEl, timeEl);

      var rating = Math.max(0, Math.min(5, Number(review.rating) || 0));
      var starsEl = document.createElement("div");
      starsEl.className = "review-stars";
      starsEl.textContent = "★★★★★☆☆☆☆☆".slice(5 - rating, 10 - rating);

      var textEl = document.createElement("p");
      textEl.textContent = "“" + review.text + "”";

      var actions = document.createElement("div");
      actions.className = "pending-actions";

      var approveBtn = document.createElement("button");
      approveBtn.type = "button";
      approveBtn.className = "btn btn--approve";
      approveBtn.textContent = "Approve";
      approveBtn.addEventListener("click", function () {
        moderate(review.id, "approve", card, [approveBtn, rejectBtn]);
      });

      var rejectBtn = document.createElement("button");
      rejectBtn.type = "button";
      rejectBtn.className = "btn btn--reject";
      rejectBtn.textContent = "Reject";
      rejectBtn.addEventListener("click", function () {
        moderate(review.id, "reject", card, [approveBtn, rejectBtn]);
      });

      actions.append(approveBtn, rejectBtn);
      card.append(head, starsEl, textEl, actions);
      pendingList.appendChild(card);
    });
  }

  function authedFetch(path, options) {
    var user = window.netlifyIdentity.currentUser();
    if (!user) return Promise.reject(new Error("Not logged in"));

    return user.jwt().then(function (token) {
      var opts = options || {};
      opts.headers = Object.assign({}, opts.headers, {
        Authorization: "Bearer " + token,
      });
      return fetch(path, opts);
    });
  }

  function loadPending() {
    setStatus("Loading pending reviews…");
    authedFetch("/.netlify/functions/reviews-pending")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load (" + res.status + ")");
        return res.json();
      })
      .then(function (reviews) {
        setStatus("");
        renderPending(reviews);
      })
      .catch(function (err) {
        setStatus("Couldn't load pending reviews: " + err.message);
      });
  }

  function moderate(id, action, card, buttons) {
    buttons.forEach(function (btn) { btn.disabled = true; });

    authedFetch("/.netlify/functions/reviews-moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, action: action }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed (" + res.status + ")");
        card.remove();
        if (!pendingList.children.length) emptyState.hidden = false;
      })
      .catch(function (err) {
        setStatus("Couldn't " + action + " review: " + err.message);
        buttons.forEach(function (btn) { btn.disabled = false; });
      });
  }

  function showLoggedIn(user) {
    loginGate.hidden = true;
    adminPanel.hidden = false;
    renderAccount(user);
    loadPending();
  }

  function showLoggedOut() {
    loginGate.hidden = false;
    adminPanel.hidden = true;
    renderAccount(null);
  }

  window.netlifyIdentity.on("init", function (user) {
    if (user) showLoggedIn(user);
    else showLoggedOut();
  });
  window.netlifyIdentity.on("login", function (user) {
    showLoggedIn(user);
    window.netlifyIdentity.close();
  });
  window.netlifyIdentity.on("logout", showLoggedOut);

  loginBtn.addEventListener("click", function () {
    window.netlifyIdentity.open("login");
  });
  refreshBtn.addEventListener("click", loadPending);

  window.netlifyIdentity.init();
})();

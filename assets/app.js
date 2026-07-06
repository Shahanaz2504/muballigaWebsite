(function () {
  "use strict";

  /* Mobile nav toggle */
  var navToggle = document.getElementById("nav-toggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* FAQ accordion */
  document.querySelectorAll(".accordion-item").forEach(function (item) {
    var trigger = item.querySelector(".accordion-trigger");
    var panel = item.querySelector(".accordion-panel");
    if (!trigger || !panel) return;

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");

      document.querySelectorAll(".accordion-item.is-open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("is-open");
          openItem.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
          openItem.querySelector(".accordion-panel").style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* Reviews: render approved reviews, or leave the "no reviews yet" message */
  var reviewGrid = document.getElementById("review-grid");
  var reviewsEmptyMessage = document.getElementById("reviews-empty-message");
  var reviews = window.STUDENT_REVIEWS || [];

  if (reviewGrid && reviews.length) {
    reviews.forEach(function (review) {
      var rating = Math.max(0, Math.min(5, Number(review.rating) || 0));

      var card = document.createElement("div");
      card.className = "review-card";

      var starsEl = document.createElement("div");
      starsEl.className = "review-stars";
      starsEl.textContent = "★★★★★☆☆☆☆☆".slice(5 - rating, 10 - rating);
      starsEl.setAttribute("aria-label", rating + " out of 5 stars");

      var textEl = document.createElement("p");
      textEl.textContent = "“" + review.text + "”";

      var citeEl = document.createElement("cite");
      citeEl.textContent = review.name;

      card.append(starsEl, textEl, citeEl);
      reviewGrid.appendChild(card);
    });

    reviewGrid.hidden = false;
    if (reviewsEmptyMessage) reviewsEmptyMessage.hidden = true;
  }

  /* Write-a-review form toggle */
  var reviewToggle = document.getElementById("review-toggle");
  var reviewFormWrap = document.getElementById("review-form-wrap");
  if (reviewToggle && reviewFormWrap) {
    reviewToggle.addEventListener("click", function () {
      var isOpen = !reviewFormWrap.hidden;
      reviewFormWrap.hidden = isOpen;
      reviewToggle.setAttribute("aria-expanded", String(!isOpen));
      reviewToggle.textContent = isOpen ? "Write a Review" : "Cancel";
      if (!isOpen) reviewFormWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* Back-to-top button */
  var backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("is-visible", window.scrollY > 480);
    });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Scroll reveal for cards/sections */
  var revealTargets = document.querySelectorAll(
    ".benefit-card, .subject-card, .schedule-card, .tutor-card, .review-card, .accordion-item, .hadith-card"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

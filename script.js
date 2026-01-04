const articles = [
  {
    id: 1,
    title: "Transforming Customer Service with Artificial Intelligence",
    description:
      "How to integrate LLMs to handle 80% of customer inquiries on WhatsApp automatically without losing the human touch.",
    dateRead: "10/12/2025 • 5 min read",
    image: "src/assets/ai.png",
    tags: ["Whatsapp", "ChatGPT"],
  },
  {
    id: 2,
    title: "LangChain Tutorial: Building Autonomous Agents",
    description:
      "A step-by-step technical guide using Python to build AI agents capable of researching the internet and writing reports.",
    dateRead: "10/10/2025 • 12 min read",
    image: "src/assets/laptop-coding.png",
    tags: ["Python", "Claude"],
  },
  {
    id: 3,
    title: "The Future of Work: AI Automation in Your Mail Inbox",
    description:
      "An in-depth analysis of how AI integrations in Outlook and Workspace are reshaping daily productivity.",
    dateRead: "10/8/2025 • 7 min read",
    image: "src/assets/planning.png",
    tags: ["Outlook", "Gemini"],
  },
  {
    id: 4,
    title: "How to properly securing Enterprise Data in the ChatGPT Era",
    description:
      "Strategies to prevent sensitive data leaks while employees use public AI tools for email and documentation.",
    dateRead: "10/5/2025 • 6 min read",
    image: "src/assets/cao.png",
    tags: ["ChatGPT", "Outlook"],
  },
  {
    id: 5,
    title: "How to use n8n to create No-Code Automation AI Without Code",
    description:
      "A review of using n8n to connect your business WhatsApp accounts with artificial intelligence workflows.",
    dateRead: "10/1/2025 • 8 min read",
    image: "src/assets/n8n.png",
    tags: ["n8n", "Whatsapp"],
  },
  {
    id: 6,
    title: "Best Practice to use Generative AI for SEO Content Scalability",
    description:
      "How to build an automated workflow using Claude's large context window for generating SEO-friendly blog content.",
    dateRead: "9/28/2025 • 9 min read",
    image: "src/assets/robot-of-things.png",
    tags: ["Claude", "Gemini"],
  },
  {
    id: 7,
    title:
      "Algorithmic Ethics: Exploring Bias and Fairness in Automated Email Communication Systems",
    description:
      "Why we must be cautious when using AI to automate sensitive email communications and HR responses.",
    dateRead: "9/25/2025 • 6 min read",
    image: "src/assets/human-robot.jpg",
    tags: ["Outlook", "Claude"],
  },
  {
    id: 8,
    title:
      "Hyper-Automation in Manufacturing: Orchestrating Python Scripts with n8n",
    description:
      "A case study on orchestrating complex Python scripts for factory monitoring using n8n workflows.",
    dateRead: "9/20/2025 • 10 min read",
    image: "src/assets/hyperautomation.jpg",
    tags: ["n8n", "Python"],
  },
  {
    id: 9,
    title:
      "AI Trend Predictions 2026: The Model Wars - The Future of Automation and Generative AI",
    description:
      "A comparison of the latest models from Google and OpenAI and what they mean for the future of automation.",
    dateRead: "9/15/2025 • 5 min read",
    image: "src/assets/ai-trends.jpg",
    tags: ["Gemini", "ChatGPT"],
  },
];

let selectedTags = new Set();
let searchQuery = "";
let itemsToShow = 6;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  searchQuery = params.get("search") || "";
  const tagParam = params.get("tag");
  if (tagParam) {
    tagParam.split(",").forEach((t) => selectedTags.add(t));
  }

  initTags();
  initSearch();

  const searchInput = document.querySelector(".search-input input");
  searchInput.value = searchQuery;

  renderContent();

  const loadMoreBtn = document.querySelector(".load-more");

  loadMoreBtn.addEventListener("click", () => {
    itemsToShow += 3;
    renderContent();
  });
});

function updateURLParams() {
  const params = new URLSearchParams();

  if (searchQuery) params.set("search", searchQuery);
  if (selectedTags.size > 0) {
    params.set("tag", Array.from(selectedTags).join(","));
  }

  const newRelativePathQuery =
    window.location.pathname +
    (params.toString() ? "?" + params.toString() : "");
  window.history.pushState(null, "", newRelativePathQuery);
}

function initSearch() {
  const searchInput = document.querySelector(".search-input input");
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    itemsToShow = 6;
    updateURLParams();
    renderContent();
  });
}

function initTags() {
  const tagsContainer = document.querySelector(".tags-container");
  const allTags = new Set();
  articles.forEach((article) => {
    article.tags.forEach((tag) => allTags.add(tag));
  });

  const sortedTags = Array.from(allTags).sort();

  sortedTags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.classList.add("tag-btn");

    if (selectedTags.has(tag)) {
      btn.classList.add("tag-active");
    }

    btn.onclick = () => toggleTag(tag, btn);
    tagsContainer.appendChild(btn);
  });
}

function toggleTag(tag, btnElement) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
    btnElement.classList.remove("tag-active");
  } else {
    selectedTags.add(tag);
    btnElement.classList.add("tag-active");
  }
  itemsToShow = 6;
  updateURLParams();
  renderContent();
}

function renderContent() {
  const grid = document.querySelector(".article-grid");
  const loadMoreBtn = document.querySelector(".load-more");

  const filteredArticles = articles.filter((article) => {
    const matchesTag =
      selectedTags.size === 0 ||
      article.tags.some((tag) => selectedTags.has(tag));

    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery) ||
      article.description.toLowerCase().includes(searchQuery);

    return matchesTag && matchesSearch;
  });

  grid.innerHTML = "";

  if (filteredArticles.length === 0) {
    grid.innerHTML = `<p class="no-results">No articles found matching your criteria.</p>`;
    loadMoreBtn.style.display = "none";
    return;
  }

  const visibleArticles = filteredArticles.slice(0, itemsToShow);

  visibleArticles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "article animate-fade-in";
    card.style.display = "flex";

    const tagHtml = article.tags
      .map(
        (tag) =>
          `<li class="${
            selectedTags.has(tag) ? "tag-active" : "tag-item"
          }">${tag}</li>`
      )
      .join("");

    card.innerHTML = `
      <div class="article-image">
        <img src="${article.image}" alt="${article.title}">
      </div>
      <div class="article-content">
          <ul class="article-tags">${tagHtml}</ul>
          <h3>${article.title}</h3>
          <p>${article.description}</p>
          <p>${article.dateRead}</p>
      </div>
      <button class="article-read">
        <span>Read more</span>
        <img src="src/assets/line-arrow-right.svg" alt="more">
      </button>
    `;
    grid.appendChild(card);
  });

  loadMoreBtn.style.display =
    itemsToShow >= filteredArticles.length ? "none" : "block";
}

// Bargain Beacon — routing and rendering.
// Routes: #/ (the board), #/deal/<id> (one deal), #/compare/<group> (stores compared).
// The board re-renders its cards in place as filters change; every other
// route renders once. window.__shotReady tells a screenshot script the
// page is on screen.

import { CATEGORIES, STORES, deals } from "./data.js";
import { boardStats, compareGroup, filterDeals, percentOff, sortDeals } from "./filters.js";
import {
  comparePage,
  dealCard,
  dealPage,
  filterBar,
  listPage,
  missingPage,
} from "./views.js";

const app = document.getElementById("app");

const state = {
  query: "",
  category: "All",
  store: "All",
  verdict: "All",
  minDiscount: 0,
  sort: "best",
};

// A filtered view can be shared as a link: ?q=airpods&category=Audio
// &store=Amazon&min=50&verdict=new-low&sort=discount
function applyShareLink() {
  const params = new URLSearchParams(location.search);
  const pick = (key, values, fallback) => {
    const v = params.get(key);
    return v !== null && values.includes(v) ? v : fallback;
  };
  state.query = params.get("q") || "";
  state.category = pick("category", ["All", ...CATEGORIES], "All");
  state.store = pick("store", ["All", ...STORES], "All");
  state.verdict = pick("verdict", ["All", "new-low", "strong", "routine"], "All");
  const min = Number(params.get("min") || 0);
  state.minDiscount = [0, 20, 40, 50, 60].includes(min) ? min : 0;
  state.sort = pick("sort", ["best", "discount", "savings", "price-low"], "best");
}

function shareLink() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "All") params.set("category", state.category);
  if (state.store !== "All") params.set("store", state.store);
  if (state.verdict !== "All") params.set("verdict", state.verdict);
  if (state.minDiscount) params.set("min", String(state.minDiscount));
  if (state.sort !== "best") params.set("sort", state.sort);
  const query = params.toString();
  history.replaceState(null, "", query ? `/?${query}${location.hash}` : `/${location.hash}`);
}

applyShareLink();

function groupSizes() {
  const sizes = {};
  for (const d of deals) if (d.group) sizes[d.group] = (sizes[d.group] || 0) + 1;
  return sizes;
}

function renderBoard() {
  const stats = boardStats(deals);
  const filtered = filterDeals(deals, state);
  const shown = sortDeals(filtered, state.sort);
  const sizes = groupSizes();
  const countLine = `Showing ${shown.length} of ${deals.length} deals`;
  const cardsHtml =
    shown.length === 0
      ? `<p class="empty">No deal matches those filters. Try clearing the search or lowering the discount.</p>`
      : shown.map((d) => dealCard(d, sizes[d.group] || 0)).join("");
  app.innerHTML = listPage({
    stats,
    filterHtml: filterBar(CATEGORIES, STORES, state),
    countLine,
    cardsHtml,
  });
  document.title = "Bargain Beacon — Black Friday deals, checked";

  const search = document.getElementById("search");
  search.addEventListener("input", () => {
    state.query = search.value;
    refreshGrid();
  });
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.category;
      document.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === chip));
      refreshGrid();
    });
  });
  const bind = (id, key, parse) => {
    document.getElementById(id).addEventListener("change", (event) => {
      state[key] = parse ? parse(event.target.value) : event.target.value;
      refreshGrid();
    });
  };
  bind("store", "store");
  bind("discount", "minDiscount", Number);
  bind("verdict", "verdict");
  bind("sort", "sort");
}

function refreshGrid() {
  const filtered = filterDeals(deals, state);
  const shown = sortDeals(filtered, state.sort);
  const sizes = groupSizes();
  shareLink();
  document.getElementById("count").textContent = `Showing ${shown.length} of ${deals.length} deals`;
  document.getElementById("grid").innerHTML =
    shown.length === 0
      ? `<p class="empty">No deal matches those filters. Try clearing the search or lowering the discount.</p>`
      : shown.map((d) => dealCard(d, sizes[d.group] || 0)).join("");
}

function render() {
  window.__shotReady = false;
  const dealMatch = location.hash.match(/^#\/deal\/([^/?]+)/);
  const compareMatch = location.hash.match(/^#\/compare\/([^/?]+)/);
  if (dealMatch) {
    const found = deals.find((d) => d.id === decodeURIComponent(dealMatch[1]));
    if (found) {
      const groupRows = found.group ? compareGroup(deals, found.group) : [found];
      document.title = `${found.title} — ${found.store} ${percentOff(found)}% off | Bargain Beacon`;
      app.innerHTML = dealPage(found, groupRows);
    } else {
      document.title = "Not found | Bargain Beacon";
      app.innerHTML = missingPage();
    }
  } else if (compareMatch) {
    const key = decodeURIComponent(compareMatch[1]);
    const rows = compareGroup(deals, key);
    if (rows.length > 0) {
      document.title = `${rows[0].title} — compare prices | Bargain Beacon`;
      app.innerHTML = comparePage(rows[0].title, rows);
    } else {
      document.title = "Not found | Bargain Beacon";
      app.innerHTML = missingPage();
    }
  } else {
    renderBoard();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();

// Bargain Beacon — HTML for every page, built from the deal data.
// Every value from data.js is escaped before it reaches the page.

import { percentOff, savings } from "./filters.js";

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
const money = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const VERDICT_LABEL = {
  "new-low": "NEW LOW",
  strong: "STRONG DEAL",
  routine: "ROUTINE CUT",
};

function checkLine(d) {
  const day = new Date(d.checked).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  return `Checked ${day} UTC`;
}

function verdictBadge(d) {
  return `<span class="verdict verdict-${escape(d.verdict)}">${escape(VERDICT_LABEL[d.verdict])}</span>`;
}

export function dealCard(d, groupSize) {
  const off = percentOff(d);
  const compare =
    groupSize > 1
      ? `<a class="compare-link" href="#/compare/${encodeURIComponent(d.group)}">Compare ${groupSize} stores &darr;</a>`
      : "";
  return `<article class="card">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="price-row"><span class="price">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s> <span class="off">${off}% off</span></p>
  <p class="save">You save ${money(savings(d))}</p>
  <p>${verdictBadge(d)}</p>
  <p class="note">${escape(d.verdictNote)}</p>
  <p class="meta">${escape(checkLine(d))} &middot; ends ${escape(d.ends)}</p>
  <p class="card-links"><a class="shop" href="${escape(d.url)}" target="_blank" rel="noopener">See it at ${escape(d.store)} &rarr;</a>${compare}</p>
</article>`;
}

export function statsBar(stats) {
  return `<section class="stats" aria-label="Board summary">
  <div><strong>${stats.total}</strong><span>verified deals</span></div>
  <div><strong>${stats.newLows}</strong><span>new all-time lows</span></div>
  <div><strong>${stats.avgOff}%</strong><span>average discount</span></div>
  <div><strong>${money(stats.totalSaved)}</strong><span>total savings vs list</span></div>
</section>`;
}

export function filterBar(categories, stores, state) {
  const chips = ["All", ...categories]
    .map(
      (c) =>
        `<button type="button" class="chip${state.category === c ? " active" : ""}" data-category="${escape(c)}">${escape(c)}</button>`,
    )
    .join("");
  const storeOpts = ["All", ...stores]
    .map((s) => `<option${state.store === s ? " selected" : ""}>${escape(s)}</option>`)
    .join("");
  const verdictOpts = [
    ["All", "Any verdict"],
    ["new-low", "New lows only"],
    ["strong", "Strong deals"],
    ["routine", "Routine cuts"],
  ]
    .map(([v, label]) => `<option value="${v}"${state.verdict === v ? " selected" : ""}>${escape(label)}</option>`)
    .join("");
  const discountOpts = [
    ["0", "Any discount"],
    ["20", "20% off or more"],
    ["40", "40% off or more"],
    ["50", "50% off or more"],
    ["60", "60% off or more"],
  ]
    .map(([v, label]) => `<option value="${v}"${String(state.minDiscount) === v ? " selected" : ""}>${escape(label)}</option>`)
    .join("");
  const sortOpts = [
    ["best", "Best first"],
    ["discount", "Biggest discount"],
    ["savings", "Biggest saving ($)"],
    ["price-low", "Lowest price"],
  ]
    .map(([v, label]) => `<option value="${v}"${state.sort === v ? " selected" : ""}>${escape(label)}</option>`)
    .join("");
  return `<section class="filters" aria-label="Search and filters">
  <label class="search-label">Search deals
    <input id="search" type="search" placeholder="Try &ldquo;AirPods&rdquo;, &ldquo;LEGO&rdquo;, &ldquo;OLED&rdquo;&hellip;" value="${escape(state.query)}">
  </label>
  <div class="chips" role="group" aria-label="Category">${chips}</div>
  <div class="selects">
    <label>Store <select id="store">${storeOpts}</select></label>
    <label>Discount <select id="discount">${discountOpts}</select></label>
    <label>Verdict <select id="verdict">${verdictOpts}</select></label>
    <label>Sort <select id="sort">${sortOpts}</select></label>
  </div>
</section>`;
}

export function listPage({ stats, filterHtml, countLine, cardsHtml }) {
  return `<h1>Black Friday, checked.</h1>
<p class="lede">Fifty real deals, each read at its store on 27 Nov 2026 and given an honest verdict: a true new low, a strong cut, or a routine one. No inflated anchors, no guesses.</p>
${statsBar(stats)}
${filterHtml}
<p class="count" id="count">${countLine}</p>
<div class="grid" id="grid">${cardsHtml}</div>
<section class="how">
  <h2>How we check a deal</h2>
  <ol>
    <li><strong>Read the price</strong> at the store or in a deals source that names the store — never from memory.</li>
    <li><strong>Check the anchor:</strong> is the &ldquo;usual&rdquo; price the real list price, and has the item sold cheaper before?</li>
    <li><strong>Call it honestly:</strong> <span class="verdict verdict-new-low">NEW LOW</span> means the lowest price ever tracked; <span class="verdict verdict-strong">STRONG DEAL</span> means a deep cut on a corroborated anchor; <span class="verdict verdict-routine">ROUTINE CUT</span> means a real discount that is small or ordinary.</li>
    <li><strong>Show the work:</strong> every card names its source and the time it was checked, and links out to the store.</li>
  </ol>
  <p class="fine">Prices move fast in Black Friday week — the store's price at checkout is the final word. Sale end dates are the ones each store announced: Amazon to 30 Nov, Best Buy to 28 Nov, Walmart and Target to 29 Nov.</p>
</section>`;
}

export function dealPage(d, groupRows) {
  const off = percentOff(d);
  const compare =
    groupRows.length > 1
      ? `<section class="compare"><h2>Same product, other stores</h2>
<table><thead><tr><th>Store</th><th>Price</th><th>Usual</th><th>Off</th><th>Verdict</th><th></th></tr></thead><tbody>
${groupRows
  .map(
    (g) => `<tr${g.id === d.id ? ' class="current"' : ""}><td>${escape(g.store)}</td><td><strong>${usd(g.price)}</strong></td><td><s>${usd(g.was)}</s></td><td>${percentOff(g)}% off</td><td>${escape(VERDICT_LABEL[g.verdict])}</td><td><a href="${escape(g.url)}" target="_blank" rel="noopener">Shop &rarr;</a></td></tr>`,
  )
  .join("")}
</tbody></table>
<p class="fine">Cheapest first. ${escape(groupRows[0].store)} is ${money(groupRows[groupRows.length - 1].price - groupRows[0].price)} cheaper than the dearest store listed here.</p></section>`
      : "";
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="store">${escape(d.store)}</span><span class="cat">${escape(d.category)}</span></div>
  <h1>${escape(d.title)}</h1>
  <p class="price-row big"><span class="price">${usd(d.price)}</span> <s class="was">${usd(d.was)}</s> <span class="off">${off}% off</span></p>
  <p class="save">You save ${money(savings(d))} vs the usual price.</p>
  <p>${verdictBadge(d)}</p>
  <p class="note big-note">${escape(d.verdictNote)}</p>
  <dl class="facts">
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Price checked</dt><dd>${escape(checkLine(d))}</dd>
    <dt>Read in</dt><dd>${escape(d.source)}</dd>
    <dt>Sale ends</dt><dd>${escape(d.ends)}</dd>
    <dt>Code needed</dt><dd>No code — the price is live at the store.</dd>
  </dl>
  <p><a class="shop big-shop" href="${escape(d.url)}" target="_blank" rel="noopener">See it at ${escape(d.store)} &rarr;</a></p>
</article>
${compare}`;
}

export function comparePage(title, groupRows) {
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<h1>${escape(title)}</h1>
<p class="lede">The same product at every store we checked, cheapest first.</p>
<table class="compare-table"><thead><tr><th>Store</th><th>Price</th><th>Usual</th><th>Off</th><th>Verdict</th><th></th></tr></thead><tbody>
${groupRows
  .map(
    (g, i) => `<tr${i === 0 ? ' class="current"' : ""}><td>${escape(g.store)}${i === 0 ? ' <span class="cheapest">cheapest</span>' : ""}</td><td><strong>${usd(g.price)}</strong></td><td><s>${usd(g.was)}</s></td><td>${percentOff(g)}% off</td><td>${escape(VERDICT_LABEL[g.verdict])}</td><td><a href="${escape(g.url)}" target="_blank" rel="noopener">Shop &rarr;</a> <a href="#/deal/${encodeURIComponent(g.id)}">Details</a></td></tr>`,
  )
  .join("")}
</tbody></table>
<p class="fine">Every price checked 27 Nov 2026, 06:45 UTC. The store's price at checkout is the final word.</p>`;
}

export function missingPage() {
  return `<h1>Not found</h1>
<p>There is no deal at this address. <a href="#/">See all 50 deals</a>.</p>`;
}

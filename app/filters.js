// Bargain Beacon — filtering and sorting. Pure functions, no DOM here,
// so the list page and the compare page share exactly one set of rules.

// Discount as a whole percent, computed from the two prices only.
export function percentOff(deal) {
  if (!deal.was || deal.was <= deal.price) return 0;
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savings(deal) {
  return Math.max(0, deal.was - deal.price);
}

// Verdict strength, for the default "best first" sort.
const VERDICT_RANK = { "new-low": 0, strong: 1, routine: 2 };

export function filterDeals(all, opts) {
  const q = (opts.query || "").trim().toLowerCase();
  const minOff = Number(opts.minDiscount || 0);
  return all.filter((d) => {
    if (opts.category && opts.category !== "All" && d.category !== opts.category) return false;
    if (opts.store && opts.store !== "All" && d.store !== opts.store) return false;
    if (opts.verdict && opts.verdict !== "All" && d.verdict !== opts.verdict) return false;
    if (percentOff(d) < minOff) return false;
    if (q) {
      const hay = `${d.title} ${d.store} ${d.category} ${d.verdictNote} ${d.source}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortDeals(shown, sortKey) {
  const rows = [...shown];
  if (sortKey === "discount") {
    rows.sort((a, b) => percentOff(b) - percentOff(a) || savings(b) - savings(a));
  } else if (sortKey === "price-low") {
    rows.sort((a, b) => a.price - b.price);
  } else if (sortKey === "savings") {
    rows.sort((a, b) => savings(b) - savings(a));
  } else {
    // "best": new lows first, then strongest, then by discount, then savings.
    rows.sort(
      (a, b) =>
        VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
        percentOff(b) - percentOff(a) ||
        savings(b) - savings(a),
    );
  }
  return rows;
}

// One-line summary numbers for the header stats bar.
export function boardStats(all) {
  const total = all.length;
  const newLows = all.filter((d) => d.verdict === "new-low").length;
  const avgOff =
    total === 0 ? 0 : Math.round(all.reduce((sum, d) => sum + percentOff(d), 0) / total);
  const totalSaved = all.reduce((sum, d) => sum + savings(d), 0);
  return { total, newLows, avgOff, totalSaved };
}

// All deals for one product group (same item at several stores),
// cheapest first. Used by the compare view.
export function compareGroup(all, groupKey) {
  return all
    .filter((d) => d.group === groupKey)
    .sort((a, b) => a.price - b.price || a.store.localeCompare(b.store));
}

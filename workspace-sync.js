// Pure conversion between the in-browser workspace and its Supabase rows (no network here, so it is unit-testable).
import { productIds, validWorkspace } from './projects.js';

export function toRows(state, owner) {
  return state.projects.map((p, position) => ({ owner, id: p.id, product: p.product, name: p.name, scenario: p.scenario, position }));
}

export function toSettings(state, owner) {
  return { owner, selected: state.selected, active: state.active };
}

// Rebuild a workspace from rows. Rows that would fail validation are dropped one by one,
// and each product's active client falls back to its first remaining client.
export function fromRows(rows, settings) {
  const candidates = [...rows]
    .sort((a, b) => a.position - b.position)
    .map(r => ({ id: r.id, product: r.product, name: r.name, scenario: r.scenario }));
  const projects = candidates.filter(p => validWorkspace({
    version: 1, selected: p.product, projects: [p],
    active: Object.fromEntries(productIds.map(id => [id, id === p.product ? p.id : null])),
  }));
  const active = Object.fromEntries(productIds.map(id => {
    const wanted = settings?.active?.[id];
    const exists = projects.some(p => p.product === id && p.id === wanted);
    return [id, exists ? wanted : (projects.find(p => p.product === id)?.id ?? null)];
  }));
  const selected = productIds.includes(settings?.selected) ? settings.selected : productIds[0];
  return { state: { version: 1, selected, projects, active }, dropped: candidates.length - projects.length };
}

// Ids that existed in the database but are no longer in the workspace → rows to delete.
export function removedIds(knownIds, state) {
  const keep = new Set(state.projects.map(p => p.id));
  return [...knownIds].filter(id => !keep.has(id));
}

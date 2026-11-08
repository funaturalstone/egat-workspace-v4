import test from 'node:test';
import assert from 'node:assert/strict';
import { freshWorkspace, addProject, removeProject, validWorkspace } from './projects.js';
import { toRows, toSettings, fromRows, removedIds } from './workspace-sync.js';

const OWNER = '00000000-0000-0000-0000-000000000001';
const roundTrip = s => fromRows(JSON.parse(JSON.stringify(toRows(s, OWNER))), JSON.parse(JSON.stringify(toSettings(s, OWNER))));

test('workspace survives a database round trip unchanged', () => {
  const s = freshWorkspace();
  const p = addProject(s, 'battery', 'โรงงาน ก & ข');
  p.scenario.initial_investment = 1234567;
  p.scenario.decision_override = 'reject';
  const { state, dropped } = roundTrip(s);
  assert.equal(dropped, 0);
  assert.ok(validWorkspace(state));
  assert.deepEqual(state, JSON.parse(JSON.stringify(s)));
});

test('client order is kept through the position column even if rows arrive shuffled', () => {
  const s = freshWorkspace();
  const rows = toRows(s, OWNER).reverse();
  const { state } = fromRows(rows, toSettings(s, OWNER));
  assert.deepEqual(state.projects.map(p => p.id), s.projects.map(p => p.id));
});

test('every row carries the owner so RLS can match it', () => {
  assert.ok(toRows(freshWorkspace(), OWNER).every(r => r.owner === OWNER));
  assert.equal(toSettings(freshWorkspace(), OWNER).owner, OWNER);
});

test('removed clients are reported for deletion, kept ones are not', () => {
  const s = freshWorkspace();
  const known = new Set(s.projects.map(p => p.id));
  const victim = s.projects[0].id;
  removeProject(s, victim);
  assert.deepEqual(removedIds(known, s), [victim]);
});

test('a corrupted row is skipped and the active client falls back to a valid one', () => {
  const s = freshWorkspace();
  const rows = toRows(s, OWNER);
  const bad = rows.find(r => r.id === s.active.battery);
  bad.scenario = { ...bad.scenario, project_life: 0 };
  const { state, dropped } = fromRows(rows, toSettings(s, OWNER));
  assert.equal(dropped, 1);
  assert.ok(validWorkspace(state));
  assert.notEqual(state.active.battery, bad.id);
  assert.ok(state.projects.some(p => p.id === state.active.battery));
});

test('missing or stale settings still produce a valid workspace', () => {
  const s = freshWorkspace();
  const { state } = fromRows(toRows(s, OWNER), { selected: 'nope', active: { solar: 'gone' } });
  assert.ok(validWorkspace(state));
  assert.equal(state.selected, 'solar');
  assert.ok(validWorkspace(fromRows(toRows(s, OWNER), null).state));
});

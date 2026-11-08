// Profile helpers used for the header chip, sidebar row and profile card.
import test from 'node:test';
import assert from 'node:assert/strict';
import { initials, displayName } from './profile.js';

test('initials come from the name, else from the email', () => {
  assert.equal(initials('Hannah Brooks', 'h@x.com'), 'HB');
  assert.equal(initials('สมชาย', ''), 'สม');
  assert.equal(initials('', 'somchai@egat.co.th'), 'SO');
  assert.equal(initials('', ''), '');
});

test('display name falls back to the email name, then to demo', () => {
  assert.equal(displayName({ display_name: '  สมชาย  ', email: 'a@b.c' }), 'สมชาย');
  assert.equal(displayName({ display_name: '', email: 'somchai@egat.co.th' }), 'somchai');
  assert.equal(displayName({ display_name: '' }), 'ผู้ใช้โหมดทดลอง');
});

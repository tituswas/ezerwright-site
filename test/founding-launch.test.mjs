import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {offer} from '../src/config/offer.mjs';
import {foundingLaunch} from '../src/config/founding-launch.mjs';

test('founding launch terms add up without changing the approved base offer', () => {
  assert.equal(foundingLaunch.totalUSD, 299);
  assert.equal(foundingLaunch.depositUSD, 150);
  assert.equal(foundingLaunch.balanceUSD, 149);
  assert.equal(foundingLaunch.depositUSD + foundingLaunch.balanceUSD, foundingLaunch.totalUSD);
  assert.equal(offer.totalUSD, 500);
  assert.equal(offer.depositUSD, 250);
  assert.equal(offer.balanceUSD, 250);
  assert.equal(offer.marketingPages, 5);
  assert.equal(offer.revisionRounds, 2);
  assert.equal(foundingLaunch.automaticallyCharges, false);
  assert.equal(foundingLaunch.requiresWrittenAcceptance, true);
});

test('production offer copy and FAQ use consistent introductory terms', () => {
  const production = JSON.parse(readFileSync('src/config/production.json', 'utf8'));
  const home = readFileSync('src/components/CinematicExperience.astro', 'utf8');
  const pages = readFileSync('src/pages/[...page].astro', 'utf8');
  const faq = production.faq.find(entry => entry.question.startsWith('When is payment due'));
  assert.match(faq.answer, /\$150 after written scope approval/);
  assert.match(faq.answer, /\$149 after explicit final staging acceptance/);
  assert.match(home, /foundingLaunch/);
  assert.match(pages, /advertisedPrice/);
  assert.match(pages, /advertisedDeposit/);
  assert.match(pages, /advertisedBalance/);
  assert.equal(production.mode, 'production');
});

test('launch messaging avoids unsupported countdown or former-sales claims', () => {
  const copy = readFileSync('src/config/founding-launch.mjs', 'utf8');
  assert.doesNotMatch(copy, /limited (?:time|slots)|formerly sold|save 40%|50% off/i);
});

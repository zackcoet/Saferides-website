#!/usr/bin/env node
/**
 * readMarketingNumbers — every number saferidesapp.com is allowed to print.
 * READ-ONLY. There is no write call anywhere in this file.
 *
 * Prints two groups:
 *   1. THE COUNTER   students home safe + rides completed, since launch.
 *   2. DRIVER PAY    guarantee rates, first-trip bonus, quest tiers.
 *
 * Run from Backend/:  node <path-to-this-file>
 */
const admin = require('firebase-admin');
const path = require('path');

const LAUNCH_ISO = '2026-08-18T00:00:00-04:00';

const KEY = path.resolve(process.cwd(), 'serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(require(KEY)) });
const db = admin.firestore();

const n = (v, d = null) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

(async () => {
  const launchMs = new Date(LAUNCH_ISO).getTime();

  // ---- exclusion rules (mirrors growth2/testAccounts.ts) ----
  const ctl = await db.doc('growthControl/state').get();
  const c = ctl.exists ? ctl.data() : {};
  const prefixes = Array.isArray(c.testAccountIdPrefixes) && c.testAccountIdPrefixes.length
    ? c.testAccountIdPrefixes
    : ['sim_driver_', 'sim_rider_', 'sim_wallet_rider_', 'sim_ride_', 'sim_txn_'];
  const excluded = new Set(Array.isArray(c.excludedUids) ? c.excludedUids : []);
  const domains = Array.isArray(c.testAccountEmailDomains) && c.testAccountEmailDomains.length
    ? c.testAccountEmailDomains
    : ['test.saferides'];

  // riders on a test email domain
  const testRiderIds = new Set();
  const riders = await db.collection('riders').get();
  for (const d of riders.docs) {
    const e = String(d.get('email') || '').toLowerCase();
    if (domains.some((dom) => e.includes(dom))) testRiderIds.add(d.id);
  }

  const isTestUid = (uid) =>
    !uid ||
    excluded.has(uid) ||
    testRiderIds.has(uid) ||
    prefixes.some((p) => String(uid).startsWith(p));

  // ---- 1. the counter ----
  const snap = await db
    .collection('rides')
    .where('status', '==', 'completed')
    .get();

  let people = 0;
  let rides = 0;
  let skippedTest = 0;
  let skippedEarly = 0;
  let skippedDupe = 0;
  const seen = new Set();

  for (const d of snap.docs) {
    const t = d.get('completedAt') || d.get('createdAt');
    const ms = t && t.toMillis ? t.toMillis() : null;
    if (ms === null || ms < launchMs) { skippedEarly++; continue; }
    const uid = d.get('riderId') || d.get('userId');
    if (isTestUid(uid) || isTestUid(d.get('driverId'))) { skippedTest++; continue; }
    // duplicate requests: same rider + same destination within 10 minutes
    const key = `${uid}|${d.get('destinationName') || d.get('destination') || ''}|${Math.floor(ms / 600000)}`;
    if (seen.has(key)) { skippedDupe++; continue; }
    seen.add(key);
    rides++;
    people += Math.max(1, n(d.get('numberOfPeople'), 1));
  }

  console.log('\n=== THE COUNTER (since ' + LAUNCH_ISO.slice(0, 10) + ') ===');
  console.log('  studentsHomeSafe :', people);
  console.log('  ridesCompleted   :', rides);
  console.log('  (excluded: test/staff ' + skippedTest + ', pre-launch ' + skippedEarly + ', duplicate ' + skippedDupe + ')');

  // ---- 2. driver pay ----
  console.log('\n=== DRIVER PAY ===');
  console.log('growthControl/state:');
  console.log('  guaranteeHourlyUsd     :', n(c.guaranteeHourlyUsd), '(code default 12)');
  console.log('  guaranteeLateHourlyUsd :', n(c.guaranteeLateHourlyUsd), '(code default 20)');
  console.log('  guaranteeLateFromHourEt:', n(c.guaranteeLateFromHourEt), '(code default 0)');
  console.log('  firstTripBonusUsd      :', n(c.firstTripBonusUsd), '(code default 10)');

  console.log('\nscheduledBonuses templates (the per-night rates drivers actually see):');
  const tpl = await db.collection('scheduledBonuses').get();
  for (const d of tpl.docs) {
    console.log(
      '  -', d.id,
      '| day:', d.get('dayOfWeek'),
      '| start:', d.get('startHour') + ':' + String(d.get('startMinute') ?? 0).padStart(2, '0'),
      '| hourly:', n(d.get('hourlyUsd')),
      '| late:', n(d.get('lateHourlyUsd')),
      '| type:', d.get('type') || d.get('bonusType'),
      '| active:', d.get('active'),
      '| title:', JSON.stringify(d.get('title')),
    );
  }

  console.log('\nactive incentives (live shifts + quests):');
  const inc = await db.collection('incentives').where('active', '==', true).get();
  for (const d of inc.docs) {
    console.log(
      '  -', d.id,
      '| type:', d.get('type') || d.get('bonusType'),
      '| hourly:', n(d.get('hourlyUsd')),
      '| late:', n(d.get('lateHourlyUsd')),
      '| payout:', n(d.get('payoutAmount')),
      '| trips:', n(d.get('tripThreshold')),
      '| tiers:', JSON.stringify(d.get('tiers') ?? null),
      '| title:', JSON.stringify(d.get('title')),
    );
  }

  console.log('\n(read-only — nothing was written)\n');
  process.exit(0);
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exit(1);
});

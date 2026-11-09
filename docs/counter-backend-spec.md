# Backend spec — public totals endpoint (+ two smaller asks)

Hand this to the Backend chat as-is. Three items, independent of each other,
in priority order.

---

## 1. `universityLeads` Firestore rule — BLOCKING, one line

`/universities` has a "Book a call" form that writes to a new collection. It
cannot write until this rule ships, and until then the form shows its error
path and tells the reader to email us instead.

```
match /universityLeads/{docId} {
  allow create: if true;
  allow read, update, delete: if isSaferidesAdmin();
}
```

Same shape as the existing `jobApplications`, `businessLeads` and
`accountDeletionRequests` entries, immediately above it in `firestore.rules`.

Document shape the site writes:

```
{ name, school, email, role|null, note|null,
  source: "marketing_site_universities", status: "new", submittedAt }
```

## 2. Email me each university lead

A Firestore `onDocumentCreated` trigger on `universityLeads/{id}` that emails
the full document to the ops inbox. Reuse whatever `jobApplications` already
does. The site cannot send this itself — mail credentials do not go in a
public web bundle.

---

## 3. The public totals endpoint

### What it returns

An `onRequest` function, public, no auth, **totals only**:

```json
{
  "studentsHomeSafe": 876,
  "ridesCompleted": 388,
  "countedAtIso": "2026-11-09"
}
```

Nothing else. No uids, no names, no phone numbers, no per-ride anything, no
breakdown by day or by driver. Anything that could identify a person or let
somebody infer our demand curve stays out — this is served to anyone who asks.

### How the numbers are defined

Over `rides` where `status == 'completed'`:

- **`studentsHomeSafe`** — the sum of `numberOfPeople`. A missing, non-numeric
  or sub-1 value counts as **1**, never 0.
- **`ridesCompleted`** — the number of those rides.
- **Since launch**: `completedAt` (falling back to `createdAt`) at or after
  **2026-08-18 00:00 ET**. Use `etWallToUtc` for the boundary — a literal
  `-04:00` is wrong from November to March, and this endpoint runs year round.
- **Exclude test and staff.** Drop a ride whose `riderId` **or** `driverId`
  is excluded, by the rules already in `growth2/testAccounts.ts`:
  `growthControl/state.excludedUids` (31 accounts today, including the
  founder's internal 6922 phone cluster — 17 rides, 41 people), the
  `sim_driver_` / `sim_rider_` / `sim_wallet_rider_` / `sim_ride_` / `sim_txn_`
  id prefixes, and riders on a `test.saferides` email.
- **Exclude duplicate requests.** Same rider, same destination, inside the same
  10-minute bucket counts once.
- **Never round, never pad.** If the honest number is 876, return 876.

### Caching

Cache hard — these numbers move a handful of times a night and the endpoint is
on a marketing page:

```
Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=86400
```

Compute from a rollup document rather than scanning `rides` on every request.
A scheduled job (hourly is plenty) writing `publicStats/totals` is the obvious
shape; the endpoint then serves that document.

### CORS

`Access-Control-Allow-Origin: https://saferidesapp.com`. The page fetches it
from the browser.

### Must not go backwards

Whatever computes the rollup should only ever raise the stored totals. The
site already refuses to display a live number smaller than the one baked into
its build, but a rollup that can dip is a bug worth catching on your side too.

### Then

Set `VITE_STATS_ENDPOINT` as a GitHub repository variable on the website repo
and the site picks it up on the next deploy. Nothing else changes.

---

## Interim: baking the number in

Until the endpoint exists the site prints the figures in
`src/config/siteStats.ts`, read out of production on 2026-11-09. To refresh
them by hand, run the read-only reader (it has no write call anywhere in it)
from `Backend/`:

```bash
node readMarketingNumbers.js
```

It prints the counter totals, the exclusion counts, the guarantee rates on
every active `scheduledBonuses` template, the first-trip bonus and the quest
tiers. Paste the two totals into `BAKED_STATS` with the date and redeploy.

---

## While you are in there — two things the reader turned up

Neither is the website's problem, but both are real.

**The first-trip bonus pays $45, not $10.** `bonuses/firstTripBonus.ts` says
the old $20-at-1-trip and $25-at-5-trips pair was replaced by a single $10
bonus at `growthControl/state.firstTripBonusUsd`. That field does not exist,
and both old incentives are still `active: true` in production:

```
incentives/f7OgYg3LGEICfqjJUrXr   $20, tripThreshold 1
incentives/ERXiC7ZhYVr1hVn3Fp5y   $25, tripThreshold 5
```

`completeRide` pays off the incentive document, so a new driver collects both
— exactly the $45 case that module's header describes as fixed. The
replacement was written but never applied to the data. The website advertises
only the $20 until this is settled.

**Weekly quests reach four drivers.** Only four
`q_weekly_2026-W46_weekly_quest_*` documents exist. The /drive page says "up
to" and "offered week by week, not to everyone", which is honest, but it is a
much smaller programme than the page's prominence implies. Worth knowing
before we push drivers at it.

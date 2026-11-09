# Photos to take

Three slots are marked in the code. Each renders a "PHOTO NEEDED" block when
you run the site locally and collapses to nothing in production, so the live
site never shows a grey box.

To fill one: put the file in `public/images/photos/`, then pass its path as
`src` to that page's `<PhotoSlot>`. Export at **1600px wide**, then run it
through `cwebp -q 82` — the hero screenshot went from 2.5MB to 34KB that way.

**No stock photography anywhere.** Nothing on this site may show a person who
is not actually one of our riders, drivers or team. Get a verbal OK from
anyone recognisable.

---

### 1. A driver in their own car — `/drive`
Landscape, 16:7. Shot from the open passenger door or just outside it. A real
SafeRides driver in the driver's seat of their own car, at night, campus or a
lit street behind them. Phone mounted or in hand showing the driver app.
Looking at camera, relaxed — this sells a job, not a safety feature.
*Avoid:* an empty car, a staged handshake, anything that looks like a stock
"gig worker".

### 2. A pickup in Five Points — `/parents`
Landscape, 16:7. Three or four students getting into a car on a Five Points
street at night. Shot from across the street, slightly wide, so the street
reads. Lit storefronts behind. Faces can be partly turned — this one is about
the situation, not the people.
*Avoid:* anything that reads as a night out gone wrong. Calm, ordinary,
end-of-the-evening.

### 3. The team — `/universities`
Landscape, 16:7. The SafeRides team on the Horseshoe, daylight, faces clearly
visible, no sunglasses. A campus safety office is deciding whether real people
run this. Four to eight people, standing, not a posed row.
*Avoid:* a dark or moody shot, a logo wall, anything that looks like a stock
startup team.

---

## Also worth having, no slot yet

- **A phone held in a real hand** showing the pickup code screen mid-ride.
  Would let the pickup-code tile carry an image instead of an icon.
- **A driver and rider matching the code at the car window.** The single most
  explanatory image on the whole site, and nothing we have shows it.
- **Campus at night, wide.** A reusable background for the counter band.

## Already in use — real app screenshots, not mockups

| Image | Where | Source |
|---|---|---|
| `public/images/app/home-screen.webp` | homepage hero | resized and compressed from `public/phone-mockup.png`, an unedited Rider app screenshot |
| `public/images/app/choose-a-ride.webp` | not yet placed | `Rider/assets/screenshots/reqeust_ride_screen.png` — the real ride-type and price screen |

`choose-a-ride.webp` is the obvious illustration for "Price before you book"
if you want an image on the safety tiles later. It is in the repo and
compressed, just not placed.

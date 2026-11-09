/**
 * A spot reserved for a real photograph we have not taken yet.
 *
 * WITH `src` it renders the photo. WITHOUT one it renders a clearly marked
 * placeholder IN DEV ONLY, and nothing at all in a production build.
 *
 * That split is deliberate. The brief asked for the spots to be obvious, and
 * they are — when you run the site locally you see exactly where a photo
 * goes and what it should be of. But a dashed grey box on saferidesapp.com
 * reads as a broken image to a parent, and a half-built site is worse than a
 * shorter one. So the live page simply closes up until the file lands.
 *
 * To fill one: drop the file in public/images/photos/ and pass its path.
 * The shot list is in docs/photo-shot-list.md.
 */
export default function PhotoSlot({
  src,
  alt,
  shot,
  className = "",
  aspect = "4 / 3",
}: {
  /** Omit until the real photo exists. Never a stock image. */
  src?: string;
  alt?: string;
  /** What the photo should be of. Shown in the dev placeholder. */
  shot: string;
  className?: string;
  aspect?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? shot}
        loading="lazy"
        decoding="async"
        className={`w-full rounded-2xl object-cover ${className}`}
        style={{ aspectRatio: aspect }}
      />
    );
  }

  if (!import.meta.env.DEV) return null;

  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-[#1740A6]/30 bg-[#1740A6]/5 p-6 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <p
        className="text-center font-body font-medium text-[#1740A6]/60"
        style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}
      >
        PHOTO NEEDED
        <br />
        <span className="font-normal">{shot}</span>
      </p>
    </div>
  );
}

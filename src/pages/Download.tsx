import { useEffect } from "react";
import { Link } from "react-router-dom";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DownloadCard from "@/components/download/DownloadCard";
import FeatureGrid from "@/components/download/FeatureGrid";
import { APP_LINKS, SUPPORT_EMAIL } from "@/config/appLinks";

const PAGE_TITLE = "Download SafeRides";
const PAGE_DESCRIPTION =
  "Get the SafeRides app - verified student drivers, upfront pricing, and a pickup code so you always get in the right car.";

/** Sets a meta tag, creating it if index.html does not already carry one. */
function setMeta(selector: string, attr: string, key: string, value: string) {
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", value);
}

export default function Download() {
  useEffect(() => {
    document.title = PAGE_TITLE;
    setMeta('meta[name="description"]', "name", "description", PAGE_DESCRIPTION);
    setMeta('meta[property="og:title"]', "property", "og:title", PAGE_TITLE);
    setMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      PAGE_DESCRIPTION,
    );
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", PAGE_TITLE);
    setMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
      PAGE_DESCRIPTION,
    );
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      <main>
        {/* Hero — deliberately short. The two cards below have to be reachable
            on a 375px phone without a real scroll, because this page is the
            destination for a flyer QR code and an Instagram bio link. */}
        <section className="mx-auto max-w-5xl px-5 pt-28 text-center sm:px-8 sm:pt-36">
          <h1
            className="font-display font-black text-brand-blue"
            style={{ fontSize: "clamp(2.5rem, 7vw, 4rem)", lineHeight: 1.03 }}
          >
            Get the app. Get home safe.
          </h1>
        </section>

        {/* The two decisions. */}
        <section className="mx-auto mt-9 max-w-5xl px-5 sm:mt-12 sm:px-8">
          <div className="grid gap-5 md:grid-cols-2">
            <DownloadCard
              heading="Ride?"
              supportingLine="Request a ride from a verified student driver."
              appLabel="rider"
              appStoreUrl={APP_LINKS.APP_STORE_RIDER}
            />
            <DownloadCard
              heading="Drive?"
              supportingLine="Earn on your own schedule between classes."
              appLabel="driver"
              appStoreUrl={APP_LINKS.APP_STORE_DRIVER}
            />
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-5xl px-5 sm:mt-28 sm:px-8">
          <h2
            className="font-display font-black text-brand-blue"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.1 }}
          >
            More info on SafeRides
          </h2>
          <div className="mt-8">
            <FeatureGrid />
          </div>

          <div className="mt-10 rounded-2xl bg-brand-blue08 p-7">
            <h3
              className="font-display font-bold text-brand-blue"
              style={{ fontSize: "1.125rem" }}
            >
              Who we are
            </h3>
            <p
              className="mt-3 font-body text-brand-blue/75"
              style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
            >
              SafeRides is operated by Coetzee Tech LLC, built at the University
              of South Carolina by a student, for students.
            </p>
          </div>
        </section>

        {/* Footer strip — support and policy links, above the site footer. */}
        <section className="mx-auto mt-20 max-w-5xl px-5 pb-20 sm:px-8">
          <div className="flex flex-col items-center gap-4 border-t border-brand-blue20 pt-9 font-body text-brand-blue/70 sm:flex-row sm:justify-between">
            <p style={{ fontSize: "0.9375rem" }}>
              Need help?{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-semibold text-brand-blue hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
            <nav className="flex gap-7" style={{ fontSize: "0.9375rem" }}>
              <Link
                to="/privacy"
                className="font-semibold text-brand-blue hover:underline"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="font-semibold text-brand-blue hover:underline"
              >
                Terms
              </Link>
            </nav>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

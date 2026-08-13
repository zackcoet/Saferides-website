import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SUPPORT_EMAIL = "saferideshelp@gmail.com";

const GROUPS: ReadonlyArray<{
  title: string;
  items: ReadonlyArray<{ q: string; a: string }>;
}> = [
  {
    title: "For brothers",
    items: [
      {
        q: "I don't see PNM Pickup after going online.",
        a: "Give it a few seconds — the app checks with our servers whether your chapter's rush window is open. If it still doesn't show, go offline and back online. If it's still missing, your chapter's rush window may not be active yet.",
      },
      {
        q: "I never set my chapter.",
        a: "Open the Driver app, go to your profile, and set your organization there. It takes effect right away — no approval, no waiting.",
      },
      {
        q: "I set the wrong chapter.",
        a: "Same place. Change it in your profile. If you're already online, go offline and back online for it to take.",
      },
      {
        q: "Do I need a bank account connected?",
        a: "Yes — same as any SafeRides driver. It's a one-time setup and it means you're ready to earn on normal rides after rush.",
      },
      {
        q: "Do I get paid for rush rides?",
        a: "No. These are free for the PNM and unpaid for you. You're driving for your chapter.",
      },
      {
        q: "Will I get normal ride requests while in PNM mode?",
        a: "No. In PNM Pickup you only get your own chapter's rush requests. Nothing else comes through.",
      },
      {
        q: "Can a guy from another chapter take my chapter's PNM?",
        a: "No. Requests only reach brothers from that chapter. It's locked on our end, not just in the app.",
      },
      {
        q: "How do I know I've got the right rider?",
        a: "Every ride has a 4-digit code. The PNM shows it, you type it in before you go.",
      },
    ],
  },
  {
    title: "What your PNMs will run into",
    items: [
      {
        q: "The price isn't $0 right away.",
        a: "It updates once the chapter's code is confirmed. If it stays at a real price, close the app and tap the link again.",
      },
      {
        q: "Do they need to add a card?",
        a: "No. Rush rides are free. There's no payment screen.",
      },
      {
        q: "Nobody is picking up the ride.",
        a: "It means no brothers from that chapter are online right now. Keep the screen open — it keeps searching. If nothing comes through, they'll get the option to request a normal paid ride instead.",
      },
      {
        q: "Do they need the app?",
        a: "Yes, the SafeRides Rider app. The link you send takes them there.",
      },
      {
        q: "Who picks them up?",
        a: "A verified student from your chapter. Your own brothers.",
      },
    ],
  },
];

export default function RushFaq() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2
          className="font-display font-black text-[#1740A6]"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.05 }}
        >
          Questions that come up.
        </h2>

        {GROUPS.map((group) => (
          <div key={group.title} className="mt-12">
            <h3
              className="font-body font-semibold uppercase text-[#1740A6]/40"
              style={{ fontSize: "0.75rem", letterSpacing: "0.14em" }}
            >
              {group.title}
            </h3>
            {/* Collapsible rather than single, so a chairman can leave one open
                while scanning the next. Everything starts closed. */}
            <Accordion type="multiple" className="mt-4">
              {group.items.map((item) => (
                <AccordionItem
                  key={item.q}
                  value={item.q}
                  className="border-b border-[#1740A614]"
                >
                  <AccordionTrigger
                    className="text-left font-display font-bold text-[#1740A6] hover:no-underline"
                    style={{ fontSize: "1rem" }}
                  >
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p
                      className="font-body text-[#1740A6]/65"
                      style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
                    >
                      {item.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        <div className="mt-12">
          <h3
            className="font-body font-semibold uppercase text-[#1740A6]/40"
            style={{ fontSize: "0.75rem", letterSpacing: "0.14em" }}
          >
            Still stuck
          </h3>
          <p
            className="mt-4 font-body text-[#1740A6]/65"
            style={{ fontSize: "0.9375rem", lineHeight: 1.6 }}
          >
            Email{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-semibold text-[#1740A6] underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

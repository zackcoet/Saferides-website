import { useState } from "react";

import { trackEvent } from "@/lib/analytics";

/**
 * The university lead form. Short on purpose — name, school, email, role, one
 * optional line. Every extra field is a lead we do not get.
 *
 * SAVES THE LEAD, same pattern as the existing jobApplications and
 * accountDeletionRequests intakes: anonymous auth, then a write to its own
 * collection. Firebase is imported lazily so this page does not pull the SDK
 * into the main bundle.
 *
 * EMAILING THE LEAD IS A BACKEND JOB, not this file's. A Firestore trigger on
 * universityLeads is the right place for it; see docs/counter-backend-spec.md.
 * Putting mail credentials in a public web bundle is not an option.
 */
type Status = "idle" | "submitting" | "success" | "error";

const INPUT =
  "w-full rounded-[8px] border border-[#1740A6]/20 bg-white px-4 py-3 font-body text-[#1740A6] placeholder:text-[#1740A6]/45 outline-none focus:border-[#1740A6]";

export default function BookACallForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({
    name: "",
    school: "",
    email: "",
    role: "",
    note: "",
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const { auth, db } = await import("@/lib/firebase");
      const { signInAnonymously } = await import("firebase/auth");
      const { addDoc, collection, serverTimestamp } = await import(
        "firebase/firestore"
      );

      try {
        await signInAnonymously(auth);
      } catch {
        // The public intake rules allow an unauthenticated write; a failure
        // here must not block the lead.
      }

      await addDoc(collection(db, "universityLeads"), {
        name: form.name.trim(),
        school: form.school.trim(),
        email: form.email.trim().toLowerCase(),
        role: form.role.trim() || null,
        note: form.note.trim() || null,
        source: "marketing_site_universities",
        status: "new",
        submittedAt: serverTimestamp(),
      });

      trackEvent("university_form_submit", { school: form.school.trim() });
      setStatus("success");
    } catch (error) {
      console.error("University lead submission failed:", error);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white/10 p-8">
        <p className="font-display text-lg font-bold text-white">
          Got it. We'll be in touch this week.
        </p>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 max-w-xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          className={INPUT}
          placeholder="Your name"
          required
          value={form.name}
          onChange={set("name")}
          disabled={busy}
        />
        <input
          className={INPUT}
          placeholder="School"
          required
          value={form.school}
          onChange={set("school")}
          disabled={busy}
        />
        <input
          className={INPUT}
          type="email"
          placeholder="Work email"
          required
          value={form.email}
          onChange={set("email")}
          disabled={busy}
        />
        <input
          className={INPUT}
          placeholder="Your role (optional)"
          value={form.role}
          onChange={set("role")}
          disabled={busy}
        />
      </div>
      <textarea
        className={`${INPUT} min-h-20 resize-y`}
        placeholder="Anything we should know? (optional)"
        value={form.note}
        onChange={set("note")}
        disabled={busy}
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-[10px] bg-white px-7 py-3.5 font-body font-semibold text-[#1740A6] disabled:opacity-60 w-fit"
      >
        {busy ? "Sending..." : "Book a call"}
      </button>
      {status === "error" && (
        <p className="font-body text-sm text-white/80">
          That didn't send. Email saferideshelp@gmail.com and we'll pick it up.
        </p>
      )}
    </form>
  );
}

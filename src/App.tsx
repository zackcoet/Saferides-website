import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import usePageViews from "./hooks/usePageViews";
import Index from "./pages/Index";
import StoryPage from "./pages/StoryPage";
import NotFound from "./pages/NotFound";

// Privacy, Terms, and Apply import the Firebase SDK, which initializes at
// module load. Lazy-load them so Firebase is never pulled into the main bundle
// and the landing page renders even when Firebase env vars are absent.
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Apply = lazy(() => import("./pages/Apply"));
const Businesses = lazy(() => import("./pages/Businesses"));
const DriversPage = lazy(() => import("./pages/DriversPage"));
const SmsConsent = lazy(() => import("./pages/SmsConsent"));
const RushPage = lazy(() => import("./pages/RushPage"));
const Download = lazy(() => import("./pages/Download"));

/**
 * Lives inside BrowserRouter because usePageViews needs the router context.
 * Renders nothing.
 */
function RouteAnalytics() {
  usePageViews();
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteAnalytics />
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/sms-consent" element={<SmsConsent />} />
          <Route path="/rush" element={<RushPage />} />
          <Route path="/download" element={<Download />} />
          {/* Alias so a mistyped flyer/bio link still lands. */}
          <Route path="/downloads" element={<Download />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

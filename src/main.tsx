import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

// Before render, so the first page_view has a configured tag to land on.
// No-ops entirely when VITE_GA4_ID is unset.
initAnalytics();

createRoot(document.getElementById("root")!).render(<App />);

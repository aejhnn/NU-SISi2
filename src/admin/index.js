import { lazy } from "react";

// Loaded on demand, so the kiosk's bundle never includes the admin pages.
export default lazy(() => import("./AdminApp.jsx"));

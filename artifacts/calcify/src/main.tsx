// v4
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";
import { inject } from "@vercel/analytics";

setBaseUrl(import.meta.env.VITE_API_BASE_URL ?? "");

inject();

createRoot(document.getElementById("root")!).render(<App />);

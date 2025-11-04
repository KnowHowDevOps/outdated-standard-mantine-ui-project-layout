import ReactDOM from "react-dom/client";
import { App } from "@/app";
import { getEnv } from "@/shared/lib/env";

// Initialize MSW if enabled
async function initializeApp() {
  // Setup MSW before rendering the app (only in development)
  if ((import.meta as any).DEV && getEnv("VITE_ENABLE_MSW") === "true") {
    try {
      const { setupMocks } = await import("@/shared/lib/msw");
      await setupMocks();
    } catch (error) {
      console.warn("MSW setup failed:", error);
    }
  }

  // Render the app
  const rootElement = document.getElementById("root")!;
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  }
}

// Start the application
initializeApp().catch(console.error);

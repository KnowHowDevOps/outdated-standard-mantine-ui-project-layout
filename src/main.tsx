import ReactDOM from "react-dom/client";
import { App } from "@/app";
import { setupMocks } from "@/shared/lib/msw";

// Initialize MSW if enabled
async function initializeApp() {
  // Setup MSW before rendering the app
  await setupMocks();

  // Render the app
  const rootElement = document.getElementById("root")!;
  if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
  }
}

// Start the application
initializeApp().catch(console.error);

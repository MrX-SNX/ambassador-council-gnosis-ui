import { createRoot } from "react-dom/client";
import App from "./App";
import { onboard } from "./utils/onboard";
import { Web3OnboardProvider } from "@web3-onboard/react";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Web3OnboardProvider web3Onboard={onboard}>
      <App />
    </Web3OnboardProvider>,
  );
}

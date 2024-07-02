import { createRoot } from "react-dom/client";
import App from "./App";
import { onboard } from "./utils/onboard";
import { Web3OnboardProvider } from "@web3-onboard/react";
import { theme } from "./utils/theme";
import { ChakraProvider } from "@chakra-ui/react";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <Web3OnboardProvider web3Onboard={onboard}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Web3OnboardProvider>,
  );
}

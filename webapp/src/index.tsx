import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./styles/globals.css";
import { activeChain } from "./react-app-env";


const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <ThirdwebProvider
        activeChain={activeChain}
        clientId={"e66788cd1c9826948949ab09632b5d0c"}
    >
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);

reportWebVitals();

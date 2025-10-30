"use client";

import { mainnet, base, polygon, celo } from "viem/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const walletConnectConnector = walletConnect({
  projectId,
  metadata: {
    name: "Onchain Portfolio",
    description: "Your shareable onchain resume.",
    url: typeof window !== "undefined" ? window.location.host : "https://app.reown.io",
    icons: ["https://app.reown.io/favicon.ico"],
  },
  showQrModal: true,
});

export const injectedConnector = injected();

const config = createConfig({
  chains: [mainnet, base, polygon, celo],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [polygon.id]: http(),
    [celo.id]: http(),
  },
  connectors: [walletConnectConnector, injectedConnector],
});

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

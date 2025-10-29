"use client";

import { ReownClient, mainnet } from "@reown/appkit";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { WagmiProvider, createConfig, http } from "wagmi";
import { walletConnect } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [
    walletConnect({
      projectId,
      metadata: {
        name: "Onchain Portfolio",
        description: "Your shareable onchain resume.",
        url: typeof window !== "undefined" ? window.location.host : "https://app.reown.io",
        icons: ["https://app.reown.io/favicon.ico"],
      },
      showQrModal: true,
    }),
  ],
});

const client = new ReownClient({
  adapter: new WagmiAdapter({ wagmi: { config } }),
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
        {children}
    </WagmiProvider>
  );
};
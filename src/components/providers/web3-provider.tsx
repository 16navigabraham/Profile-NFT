"use client";

import { mainnet } from "viem/chains";
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

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
        {children}
    </WagmiProvider>
  );
};

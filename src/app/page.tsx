import Header from "@/components/dashboard/header";
import WalletManager from "@/components/dashboard/wallet-manager";
import TransactionHistory from "@/components/dashboard/transaction-history";
import GasAnalysis from "@/components/dashboard/gas-analysis";
import TopTokens from "@/components/dashboard/top-tokens";
import TopNfts from "@/components/dashboard/top-nfts";
import OnchainStory from "@/components/dashboard/onchain-story";
import WalletStats from "@/components/dashboard/wallet-stats";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-1 flex flex-col gap-6">
            <WalletManager />
            <WalletStats />
            <OnchainStory />
          </div>
          <div className="xl:col-span-3 flex flex-col gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <TopTokens />
              <GasAnalysis />
            </div>
            <TransactionHistory />
            <TopNfts />
          </div>
        </div>
      </main>
    </div>
  );
}


"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export type Transaction = {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  isError: string;
  blockNumber: string;
};

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

const fetchTransactions = async (address?: string, chainId?: number): Promise<Transaction[]> => {
    if (!address || !chainId) {
        return [];
    }

    const response = await fetch(`/api/transactions?address=${address}&chainId=${chainId}&page=1&offset=100`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch transactions.');
    }
    
    if (data.status === "1") {
        return data.result;
    } else {
        if (data.message !== 'No transactions found' && data.result) {
          throw new Error(data.message || data.result);
        }
        return []; // Return empty array for "No transactions found"
    }
};


export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected, chainId } = useAccount();

  const { data: transactions, isLoading, error, refetch } = useQuery<Transaction[], Error>({
      queryKey: ['transactions', address, chainId],
      queryFn: () => fetchTransactions(address, chainId),
      enabled: isConnected && !!address && !!chainId,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
  });

  const value = {
    transactions: transactions || [],
    isLoading,
    error: error?.message || null,
    refetch,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};

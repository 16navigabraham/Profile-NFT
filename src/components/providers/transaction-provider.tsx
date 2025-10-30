
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useAccount } from "wagmi";

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

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected, chainId } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);

  const fetchTransactions = useCallback(async (currentAddress: string, currentChainId: number) => {
    if (isFetching.current) return;
    
    isFetching.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/transactions?address=${currentAddress}&chainId=${currentChainId}&page=1&offset=100`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch transactions.');
      }
      
      if (data.status === "1") {
        setTransactions(data.result);
      } else {
        setTransactions([]);
        if (data.message !== 'No transactions found' && data.result) {
          setError(data.message || data.result);
        }
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      setTransactions([]);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, []);
  
  useEffect(() => {
    if (isConnected && address && chainId) {
      fetchTransactions(address, chainId);
    } else {
      setTransactions([]);
      setError(null);
      setIsLoading(false);
    }
  }, [address, isConnected, chainId, fetchTransactions]);

  const refetch = useCallback(() => {
    if (isConnected && address && chainId) {
      fetchTransactions(address, chainId);
    }
  }, [isConnected, address, chainId, fetchTransactions]);

  const value = {
    transactions,
    isLoading,
    error,
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

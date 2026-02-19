"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getActiveMandate } from "@/app/(Authenticated-routes)/presidentes/actions";
import { ActiveMandate } from "@/types/mandate";

interface ActiveMandateContextValue {
  activeMandate: ActiveMandate | null;
  loading: boolean;
  refreshActiveMandate: () => Promise<void>;
}

const ActiveMandateContext = createContext<ActiveMandateContextValue | undefined>(undefined);
const ACTIVE_MANDATE_STORAGE_KEY = "active_mandate_cache";
const ACTIVE_MANDATE_MAX_AGE_MS = 10 * 60 * 1000;

interface ActiveMandateStorage {
  updatedAt: number;
  data: ActiveMandate | null;
}

export const ActiveMandateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMandate, setActiveMandate] = useState<ActiveMandate | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshActiveMandate = useCallback(async () => {
    setLoading(true);
    try {
      const mandate = await getActiveMandate();
      setActiveMandate(mandate);
    } catch {
      setActiveMandate(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const rawValue = window.sessionStorage.getItem(ACTIVE_MANDATE_STORAGE_KEY);
        if (rawValue) {
          const parsedValue = JSON.parse(rawValue) as ActiveMandateStorage;
          if (Date.now() - parsedValue.updatedAt <= ACTIVE_MANDATE_MAX_AGE_MS) {
            setActiveMandate(parsedValue.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        setActiveMandate(null);
      }
    }
    refreshActiveMandate();
  }, [refreshActiveMandate]);

  useEffect(() => {
    if (typeof window === "undefined" || loading) {
      return;
    }
    const payload: ActiveMandateStorage = {
      updatedAt: Date.now(),
      data: activeMandate,
    };
    window.sessionStorage.setItem(ACTIVE_MANDATE_STORAGE_KEY, JSON.stringify(payload));
  }, [activeMandate, loading]);

  const value = useMemo(
    () => ({
      activeMandate,
      loading,
      refreshActiveMandate,
    }),
    [activeMandate, loading, refreshActiveMandate]
  );

  return <ActiveMandateContext.Provider value={value}>{children}</ActiveMandateContext.Provider>;
};

export function useActiveMandate(): ActiveMandateContextValue {
  const context = useContext(ActiveMandateContext);
  if (!context) {
    throw new Error("useActiveMandate must be used inside ActiveMandateProvider");
  }
  return context;
}

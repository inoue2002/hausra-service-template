'use client';
import { Liff } from '@line/liff';
import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

const LiffContext = createContext<{
  liff: Liff | null;
  liffError: string | null;
}>({ liff: null, liffError: null });

export const useLiff = () => useContext(LiffContext);

export const LiffProvider: FC<PropsWithChildren<{ liffId: string }>> = ({ children, liffId }) => {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  const initLiff = useCallback(async () => {
    try {
      const liffModule = await import('@line/liff');
      const liffInstance = liffModule.default;

      await liffInstance.init({ liffId });

      console.log('LIFF init succeeded.');
      setLiff(liffInstance);
    } catch (error) {
      console.error('LIFF init failed:', error);
      setLiffError(error instanceof Error ? error.message : String(error));
    }
  }, [liffId]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !liff) {
      initLiff();
    }
    return () => {
      // if (liff && liff.isLoggedIn()) {
      //   liff.logout();
      // }
    };
  }, [liff, initLiff]);

  // if (liffError) {
  //   return <div>Error initializing LIFF: {liffError}</div>;
  // }

  // if (!liff) {
  //   return <div>Loading LIFF...</div>;
  // }

  return (
    <LiffContext.Provider value={{ liff, liffError }}>
      {children}
    </LiffContext.Provider>
  );
};
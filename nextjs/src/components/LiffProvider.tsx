'use client';
import type { Profile } from '@liff/get-profile';
import { Liff } from '@line/liff';
import { LiffMockPlugin } from '@line/liff-mock';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';

const LiffContext = createContext<{
  liff: Liff | null;
  liffError: string | null;
  lineProfile: Profile | null;
}>({ liff: null, liffError: null, lineProfile: null });

export const useLiff = () => useContext(LiffContext);

interface LiffProviderProps extends PropsWithChildren {
  liffId: string;
}

export const LiffProvider = ({ children, liffId }: LiffProviderProps) => {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [lineProfile, setLineProfile] = useState<Profile | null>(null);

  const initLiff = useCallback(async () => {
    try {
      const isDev = process.env.NODE_ENV === 'development';
      const liff = (await import('@line/liff')).default;
      const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '';

      liff.use(new LiffMockPlugin());

      await liff.init({
        liffId: liffId,
        // @ts-ignore
        mock: isDev,
      });

      if(!liff.isLoggedIn()){
        liff.login();
      }

      const profile = await liff.getProfile();
      setLineProfile(profile);
      console.log(profile)

      console.log('LIFF init succeeded.');

      setLiff(liff);
    } catch (error) {
      console.error('LIFF init failed:', error);
      setLiffError(error instanceof Error ? error.message : String(error));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !liff) {
      initLiff();
    }
    return () => {
      if (liff && liff.isLoggedIn()) {
        liff.logout();
      }
    };
  }, [liff, initLiff]);

  if (liffError) {
    return <div>LIFFの初期化中にエラーが発生しました: {liffError}</div>;
  }

  if (!liff) {
    return <div>LIFFを読み込み中...</div>;
  }

  return <LiffContext.Provider value={{ liff, liffError, lineProfile }}>{children}</LiffContext.Provider>;
};

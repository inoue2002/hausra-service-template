'use client';
import type { Profile } from '@liff/get-profile';
import { Liff } from '@line/liff';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { useLiff } from './LiffProvider';

import { VerifyTokenDocument, VerifyTokenMutation } from '@/generated/graphql';
import { useMutation } from '@apollo/client';
import firebase from 'firebase/compat/app';

import { auth } from '@/firebase/client';

const AuthContext = createContext<{
  liff: Liff | null;
  liffError: string | null;
  lineProfile: Profile | null;
  isLoggedIn: boolean;
}>({ liff: null, liffError: null, lineProfile: null, isLoggedIn: false });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps extends PropsWithChildren {}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { lineProfile, liff, liffError } = useLiff();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [verifyToken] = useMutation<VerifyTokenMutation>(VerifyTokenDocument);

  useEffect(() => {
    const verifyIdToken = async () => {
      if (lineProfile) {
        const idToken = liff?.getIDToken();
        console.log(idToken);
        if (!idToken) {
          liff?.login();
        } else {
          try {
            const { data } = await verifyToken({ variables: { id: idToken } });
            if (data?.verify?.firebaseToken) {
              setIsLoggedIn(true);
              // firebaseTokenを使ってFirebase Authenticationにログイン
              await firebase.auth().signInWithCustomToken(data.verify.firebaseToken);
            }
          } catch (error) {
            console.error('トークン検証エラー:', error);
            window.alert('ログインエラー');
          }
        }
      }
    };

    verifyIdToken();
  }, [liff, lineProfile, verifyToken]);

  // firebase Authのログインを監視
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        window.alert('ログイン成功');
        setIsLoggedIn(true);
      } else {
        window.alert('ログアウト');
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ liff, liffError, lineProfile, isLoggedIn }}>{children}</AuthContext.Provider>;
};

'use client';
import { LiffProvider } from '@/components/LiffProvider';
import { ApolloProvider } from '@apollo/client';
import { Inter } from 'next/font/google';
import client from '../appolo/client';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || '';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ApolloProvider client={client}>
          <LiffProvider liffId={LIFF_ID}>
            <section>
              <nav></nav>
              {children}
            </section>
          </LiffProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}

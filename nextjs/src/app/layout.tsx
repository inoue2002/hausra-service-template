'use client';
import { ApolloProvider } from '@apollo/client';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

import client from '../appolo/client';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </body>
    </html>
  );
}

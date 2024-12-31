import type { Metadata } from 'next';
import React from 'react';
import { workSans } from '@/theme/fonts';
import ThemeProviderWrapper from '@/theme/ThemeProviderWrapper';
import StoreProvider from '@/store/StoreProvider';
import Header from '@/components/Header/Header';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Coin App',
  description: 'Coin App',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className={workSans.className}>
        <StoreProvider>
          <ThemeProviderWrapper>
            <Header />
            {children}
            <Toaster
              position={'bottom-right'}
              toastOptions={{ className: 'react-hot-toast', duration: 4000 }}
              containerStyle={{ zIndex: '20000 ! Important' }}
            />
          </ThemeProviderWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}

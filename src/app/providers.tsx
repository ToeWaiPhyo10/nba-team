'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { reduxStore, persistor } from '@/store';
import { Toaster } from '@/components/ui/sonner';
import { Loading } from '@/components/ui/loading';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={reduxStore}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <NuqsAdapter>
          {children}
          <Toaster richColors />
        </NuqsAdapter>
      </PersistGate>
    </Provider>
  );
}

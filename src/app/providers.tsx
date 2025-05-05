'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { reduxStore, persistor } from '@/store';
import { Toaster } from '@/components/ui/sonner';
import { Loading } from '@/components/ui/loading';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={reduxStore}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {children}
        <Toaster richColors />
      </PersistGate>
    </Provider>
  );
}

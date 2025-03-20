"use client";

import { AppStore, makeStore } from "@/store/store";
import { setupListeners } from "@reduxjs/toolkit/query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const MoonPayProvider = dynamic(
    () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayProvider),
    { ssr: false }
  );

  const queryClient = new QueryClient();

  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current != null) {
      const unsubscribe = setupListeners(storeRef.current.dispatch);

      return unsubscribe;
    }
  }, []);

  return (
    <MoonPayProvider apiKey={process.env.NEXT_PUBLIC_MOONPAY_API_KEY || ""}>
      <Provider store={storeRef.current}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    </MoonPayProvider>
  );
};

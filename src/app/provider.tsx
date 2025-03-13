"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WepinLogin } from "@wepin/login-js";
import { useEffect, useState } from "react";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  const [wepinLogin, setWepinLogin] = useState<WepinLogin>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@wepin/login-js").then(({ WepinLogin }) => {
        const wepinLoginInstance = new WepinLogin({
          appId: process.env.NEXT_PUBLIC_WEPIN_APP_ID as string,
          appKey: process.env.NEXT_PUBLIC_WEPIN_APP_KEY as string,
        });
        setWepinLogin(wepinLoginInstance);

        const init = async () => {
          await wepinLoginInstance.init();
          setIsInitialized(true);
        };
        init();

        wepinLoginInstance.changeLanguage("ko");
      });
    }
  }, []);

  const loginFnc = async () =>
    await wepinLogin?.loginWithOauthProvider({ provider: "google" });
  const logoutFnc = async () => await wepinLogin?.logout();

  return (
    <QueryClientProvider client={queryClient}>
      {isInitialized ? (
        <>
          <button onClick={loginFnc}>로그인</button>
          <button onClick={logoutFnc}>로그아웃</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
      {children}
    </QueryClientProvider>
  );
};

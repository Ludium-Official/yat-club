"use client";

import Header from "@/components/Header";
import {
  getWepinLoginInstance,
  initializeWepinLogin,
  selectIsInitialized,
} from "@/lib/features/wepin/loginSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    if (typeof window !== "undefined") {
      dispatch(initializeWepinLogin());
    }
  }, [dispatch]);

  const loginFnc = async () =>
    await getWepinLoginInstance()?.loginWithOauthProvider({
      provider: "google",
    });
  const logoutFnc = async () => await getWepinLoginInstance()?.logout();

  return (
    <div>
      <Header />
      {isInitialized ? (
        <>
          <button onClick={() => dispatch(loginFnc)}>로그인</button>
          <button onClick={() => dispatch(logoutFnc)}>로그아웃</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Wrapper;

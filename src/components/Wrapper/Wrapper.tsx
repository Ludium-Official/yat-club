"use client";

import Header from "@/components/Header";
import {
  getWepinSDK,
  initializeWepinWidget,
  selectIsInitialized,
} from "@/lib/features/wepin/loginSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { Button } from "../ui/button";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  const isInitialized = useAppSelector(selectIsInitialized);

  useEffect(() => {
    if (typeof window !== "undefined") {
      dispatch(initializeWepinWidget());
    }
  }, [dispatch]);

  const login = async () => console.log(await getWepinSDK()?.loginWithUI());
  const logout = async () => await getWepinSDK()?.logout();
  const status = async () => console.log(await getWepinSDK()?.getStatus());
  const open = async () => await getWepinSDK()?.openWidget();
  const account = async () => console.log(await getWepinSDK()?.getAccounts());
  const balance = async () =>
    console.log(
      await getWepinSDK()?.getBalance([
        {
          address: "9B1wjMER4xHpaqxSdsG64orv2CSqtmfmjecNkuKfhGCw",
          network: "SOLANA",
        },
      ])
    );

  return (
    <div>
      <Header />
      {isInitialized ? (
        <div>
          <Button onClick={login}>Login</Button>
          <Button onClick={logout}>Logout</Button>
          <Button onClick={status}>Status</Button>
          <Button onClick={open}>Open</Button>
          <Button onClick={account}>Get Account</Button>
          <Button onClick={balance}>Get Balance</Button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Wrapper;

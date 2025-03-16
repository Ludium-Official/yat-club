"use client";

import { Button } from "@/components/ui/button";
import { setBalances } from "@/lib/features/wepin/balanceSlice";
import {
  getWepinSDK,
  selectIsLoggedIn,
  setIsLoggedIn,
} from "@/lib/features/wepin/loginSlice";
import fetchData from "@/lib/fetchData";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { isEmpty, prop, uniqBy } from "ramda";
import { useCallback, useEffect, useState } from "react";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const wepinSDK = getWepinSDK();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const getBalance = useCallback(async () => {
    const removeDuplicates = uniqBy(prop("network"));
    const accounts = removeDuplicates(await wepinSDK.getAccounts());
    const balances = await wepinSDK.getBalance(accounts);

    dispatch(setBalances(balances));
    dispatch(setIsLoggedIn(true));
  }, [dispatch, wepinSDK]);

  useEffect(() => {
    const status = async () => {
      const wepinStatus = await wepinSDK.getStatus();

      if (wepinStatus === "login") {
        try {
          setIsLoggingIn(true);
          await getBalance();
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    status();
  }, [dispatch, getBalance, isLoggedIn, wepinSDK]);

  const login = async () => {
    setIsLoggingIn(true);

    try {
      const user = await wepinSDK.loginWithUI();
      const findUser = await fetchData("/user", "POST", {
        userId: user.userInfo?.userId,
      });

      if (isEmpty(findUser)) {
        await fetchData("/register", "POST", {
          email: user.userInfo?.email,
          provider: user.userInfo?.provider,
          userId: user.userInfo?.userId,
          walletId: user.walletId,
        });
      }

      await getBalance();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await wepinSDK.logout();
      dispatch(setIsLoggedIn(false));
    } catch (err) {
      console.error(err);
    }
  };

  const openWidget = async () => await wepinSDK.openWidget();

  return (
    <div>
      {isLoggedIn ? (
        <>
          <Button onClick={logout}>Logout</Button>
          <Button onClick={openWidget}>Open Widget</Button>
        </>
      ) : isLoggingIn ? (
        <Button disabled>ing...</Button>
      ) : (
        <Button onClick={login}>Login</Button>
      )}
    </div>
  );
};

export default Header;

"use client";

import HeaderLogo from "@/assets/Header/HeaderLogo.svg";
import ImgComponent from "@/components/Image";
import { Button } from "@/components/ui/button";
import { setBalances } from "@/lib/features/wepin/balanceSlice";
import {
  selectIsLoggedIn,
  setIsLoggedIn,
  setUserInfo,
} from "@/lib/features/wepin/loginSlice";
import {
  accountsSDK,
  balanceSDK,
  statusSDK,
  userLoginSDK,
} from "@/lib/features/wepin/useWepin";
import fetchData from "@/lib/fetchData";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { isEmpty } from "ramda";
import { useCallback, useEffect, useState } from "react";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const callUser = useCallback(async () => {
    const user = await userLoginSDK();
    const findUser = await fetchData("/user", "POST", {
      userId: user.userInfo?.userId,
    });

    dispatch(setUserInfo(!isEmpty(findUser) ? findUser[0] : null));

    return findUser;
  }, [dispatch]);

  const getBalance = useCallback(async () => {
    dispatch(setIsLoggedIn(true));

    const accounts = await accountsSDK();
    const balances = await balanceSDK(accounts);

    dispatch(setBalances(balances));
  }, [dispatch]);

  useEffect(() => {
    const status = async () => {
      const wepinStatus = await statusSDK();

      if (wepinStatus === "login") {
        try {
          setIsLoggingIn(true);
          await callUser();
          await getBalance();
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    status();
  }, [callUser, dispatch, getBalance, isLoggedIn]);

  const login = async () => {
    setIsLoggingIn(true);

    try {
      const user = await callUser();

      if (isEmpty(user)) {
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

  const buttonText = isLoggingIn ? "Ing..." : "Login";
  const buttonOnClick = isLoggingIn ? undefined : login;

  return (
    <div className="flex items-center justify-between mx-16 my-20">
      <Link href="/">
        <ImgComponent imgSrc={HeaderLogo.src} />
      </Link>
      {isLoggedIn ? (
        <Link
          className="bg-brand rounded-full px-10 py-8 text-white"
          href="/mypage"
        >
          Mypage
        </Link>
      ) : (
        <Button
          onClick={buttonOnClick}
          className="bg-brand"
          disabled={isLoggingIn && !isLoggedIn}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default Header;

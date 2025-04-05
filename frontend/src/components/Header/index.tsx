"use client";

import HeaderLogo from "@/assets/Header/HeaderLogo.svg";
import OpHeaderLogo from "@/assets/Header/OpHeaderLogo.svg";
import UserDefaultIcon from "@/assets/Header/UserDefaultIcon.svg";
import ImgComponent from "@/components/Image";
import { Button } from "@/components/ui/button";
import { setAccounts } from "@/lib/features/wepin/accountsSlice";
import {
  selectIsLoggedIn,
  selectUserInfo,
  setIsLoggedIn,
  setUserInfo,
} from "@/lib/features/wepin/loginSlice";
import {
  accountsSDK,
  statusSDK,
  userLoginSDK,
} from "@/lib/features/wepin/useWepin";
import fetchData from "@/lib/fetchData";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { isEmpty } from "ramda";
import { useCallback, useEffect } from "react";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector(selectUserInfo);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const callUser = useCallback(async () => {
    const user = await userLoginSDK();
    const findUser = await fetchData("/user", "POST", {
      userId: user.userInfo?.userId,
    });

    dispatch(setUserInfo(!isEmpty(findUser) ? findUser[0] : null));

    return {
      isSignIn: !isEmpty(findUser),
      userData: {
        email: user.userInfo?.email,
        provider: user.userInfo?.provider,
        userId: user.userInfo?.userId,
        walletId: user.walletId,
      },
    };
  }, [dispatch]);

  const getBalance = useCallback(async () => {
    dispatch(setIsLoggedIn(true));

    const accounts = await accountsSDK();

    dispatch(setAccounts(accounts));
  }, [dispatch]);

  useEffect(() => {
    const status = async () => {
      const wepinStatus = await statusSDK();

      if (wepinStatus === "login") {
        try {
          await callUser();
          await getBalance();
        } catch (err) {
          console.error(err);
        }
      }
    };

    status();
  }, [callUser, dispatch, getBalance, isLoggedIn]);

  const login = async () => {
    try {
      const user = await callUser();

      if (!user.isSignIn) {
        await fetchData("/register", "POST", {
          email: user.userData?.email,
          provider: user.userData?.provider,
          userId: user.userData?.userId,
          walletId: user.userData.walletId,
        });
      }

      await getBalance();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-20 py-10 border-b">
      <Link href="/">
        <ImgComponent imgSrc={isLoggedIn ? OpHeaderLogo : HeaderLogo} />
      </Link>
      <div className="flex items-center gap-10">
        {userInfo?.auth === "ADMIN" && (
          <Link
            href="/create"
            className="bg-mid-blue px-12 py-6 rounded-[1rem] text-blue text-[1.2rem] border border-mid-blue2"
          >
            Create event
          </Link>
        )}
        {userInfo?.auth !== "ADMIN" && (
          <Link
            href="/membership"
            className="bg-mid-blue px-12 py-6 rounded-[1rem] text-blue text-[1.2rem] border border-mid-blue2"
          >
            Membership
          </Link>
        )}
        {isLoggedIn ? (
          <Link className="rounded-full w-30 h-30" href="/mypage">
            <div
              style={{
                backgroundImage: `url(${
                  userInfo?.profile_url || UserDefaultIcon.src
                })`,
              }}
              className="aspect-square w-30 bg-no-repeat bg-cover bg-center rounded-full"
            />
          </Link>
        ) : (
          <Button
            onClick={login}
            className="bg-transparent border border-[#87B8FF] text-[#87B8FF] text-[1.2rem]"
          >
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;

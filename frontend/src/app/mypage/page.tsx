"use client";

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper/Wrapper";
import {
  getWepinSDK,
  selectUserInfo,
  setIsLoggedIn,
  setUserInfo,
} from "@/lib/features/wepin/loginSlice";
import { logoutSDK } from "@/lib/features/wepin/useWepin";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Mypage() {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);

  const statusSDK = async () => {
    const wepinSDK = getWepinSDK();

    const status = await wepinSDK.getStatus();

    return status;
  };

  useEffect(() => {
    const status = async () => {
      const wepinStatus = await statusSDK();

      if (wepinStatus !== "login") {
        route.push("/");
      }
    };

    status();
  }, [route, userInfo]);

  const logout = async () => {
    try {
      dispatch(setIsLoggedIn(false));
      dispatch(setUserInfo(null));

      await logoutSDK();
      route.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      {userInfo ? (
        <div>
          <div>Email: {userInfo.email}</div>
          <div>Point: {userInfo.yatPoint}</div>
        </div>
      ) : (
        <div>null</div>
      )}
      <Button onClick={logout}>Logout</Button>
    </Wrapper>
  );
}

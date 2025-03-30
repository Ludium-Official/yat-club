"use client";

import ProfileLogo from "@/assets/Header/ProfileLogo.svg";
import EditIcon from "@/assets/Mypage/EditIcon.svg";
import PointIcon from "@/assets/Mypage/PointIcon.svg";
import WalletIcon from "@/assets/Mypage/WalletIcon.svg";
import EventList from "@/components/EventList";
import ImgComponent from "@/components/Image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wrapper from "@/components/Wrapper";
import {
  getWepinSDK,
  selectUserInfo,
  setIsLoggedIn,
  setUserInfo,
} from "@/lib/features/wepin/loginSlice";
import { logoutSDK } from "@/lib/features/wepin/useWepin";
import fetchData from "@/lib/fetchData";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { division } from "@/lib/utils";
import { ParseEventType } from "@/types/eventType";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function Mypage() {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);

  const [isEditName, setIsEditName] = useState(false);
  const [userName, setUserName] = useState(userInfo?.name || "");
  const [isPast, setIsPast] = useState(false);
  const [events, setEvents] = useState<ParseEventType>();
  const [page, setPage] = useState(1);

  const statusSDK = async () => {
    const wepinSDK = getWepinSDK();

    const status = await wepinSDK.getStatus();

    return status;
  };

  const logout = async () => {
    try {
      await logoutSDK();

      dispatch(setIsLoggedIn(false));
      dispatch(setUserInfo(null));

      route.push("/");
    } catch (err) {
      console.error(err);
    }
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

  useEffect(() => {
    const init = async () => {
      const events = await fetchData("/user-events", "POST", {
        isPast,
        userId: userInfo?.id,
      });

      const totalEvent = events.length;
      const splitEvents = division(events, 5);

      setEvents({
        event: splitEvents,
        totalEvent: totalEvent,
      });
      setPage(1);
    };

    init();
  }, [isPast, userInfo]);

  const nameChange = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await fetchData("/user/edit", "POST", {
        userId: userInfo?.userId,
        userName,
      });

      const findUser = await fetchData("/user", "POST", {
        userId: userInfo?.userId,
      });

      dispatch(setUserInfo(findUser[0]));
      setIsEditName(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      {userInfo ? (
        <div className="flex flex-col justify-between h-full">
          <div>
            <div className="flex gap-20 mx-20 mt-30 mb-11 px-20 py-24 rounded-[2rem] border border-gray2 bg-white">
              <ImgComponent imgSrc={ProfileLogo.src} />
              <div className="flex justify-between w-full">
                <div className="flex flex-col w-full">
                  {isEditName ? (
                    <form
                      className="flex items-center gap-3"
                      onSubmit={nameChange}
                    >
                      <Input
                        value={userName}
                        className="max-w-[10rem] h-[2.4rem]"
                        onChange={(e) => setUserName(e.target.value)}
                        required
                      />
                      <Button
                        className="p-5 rounded-md border border-gray3 text-[1rem]"
                        type="submit"
                      >
                        Edit
                      </Button>
                    </form>
                  ) : (
                    <div className="text-[2rem] font-normal">
                      {userInfo.name}
                    </div>
                  )}
                  <div className="text-[0.8rem] text-gray1">
                    {userInfo.email}
                  </div>
                  <div className="grid grid-cols-2 gap-7 mt-14">
                    <div className="flex flex-col items-center p-8 rounded-[2rem] border border-gray3">
                      <div className="flex items-center gap-2 text-[0.8rem]">
                        <ImgComponent imgSrc={WalletIcon.src} />
                        <div className="px-4 py-3 rounded-lg bg-brand text-white">
                          Token
                        </div>
                      </div>
                      <div className="mt-6 text-[2.6rem] text-brand font-normal">
                        30
                      </div>
                    </div>
                    <div className="flex flex-col items-center p-8 rounded-[2rem] border border-gray3">
                      <div className="flex items-center gap-2 text-[0.8rem]">
                        <ImgComponent imgSrc={PointIcon.src} />
                        <div
                          style={{
                            background:
                              "linear-gradient(to right bottom, #007dfe 0%, #04c7db 100%)",
                          }}
                          className="px-4 py-3 rounded-lg text-white"
                        >
                          Point
                        </div>
                      </div>
                      <div
                        style={{
                          background:
                            "linear-gradient(to right bottom, #007dfe 0%, #04c7db 100%)",
                          color: "transparent",
                          WebkitBackgroundClip: "text",
                        }}
                        className="mt-6 text-[2.6rem] font-normal"
                      >
                        {userInfo.yatPoint}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="cursor-pointer w-22 h-22"
                  onClick={() => setIsEditName((prev) => !prev)}
                >
                  <ImgComponent imgSrc={EditIcon.src} />
                </div>
              </div>
            </div>
            <div>
              <div className="mx-20 mt-20 mb-10 text-[2rem] font-normal">
                My events list
              </div>
              <EventList
                isPast={isPast}
                setIsPast={setIsPast}
                page={page}
                setPage={setPage}
                events={events}
              />
            </div>
          </div>
          <Button
            onClick={logout}
            className="mx-20 mt-20 bg-sky-blue text-white"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div>null</div>
      )}
    </Wrapper>
  );
}

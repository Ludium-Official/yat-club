"use client";

import EditIcon from "@/assets/common/EditIcon.svg";
import ArrowIcon from "@/assets/Mypage/ArrowIcon.svg";
import LogoutIcon from "@/assets/Mypage/LogoutIcon.svg";
import PointIcon from "@/assets/Mypage/PointIcon.svg";
import ProfileConfirmIcon from "@/assets/Mypage/ProfileConfirmIcon.svg";
import ProfileEditIcon from "@/assets/Mypage/ProfileEditIcon.svg";
import UserDefaultIcon from "@/assets/Mypage/UserDefaultIcon.svg";
import EventList from "@/components/EventList";
import ImgComponent from "@/components/Image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Wrapper from "@/components/Wrapper";
import {
  getWepinSDK,
  selectUserInfo,
  setIsLoggedIn,
  setUserInfo,
} from "@/lib/features/wepin/loginSlice";
import { logoutSDK, openWidgetSDK } from "@/lib/features/wepin/useWepin";
import fetchData from "@/lib/fetchData";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { commaNumber, division } from "@/lib/utils";
import { ParseEventType } from "@/types/eventType";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Mypage() {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditName, setIsEditName] = useState(false);
  const [userName, setUserName] = useState(userInfo?.name || "");
  const [isPast, setIsPast] = useState(false);
  const [events, setEvents] = useState<ParseEventType>();
  const [page, setPage] = useState(1);
  const [previewImg, setPreviewImg] = useState("");
  const [isEditProfileImg, setIsEditProfileImg] = useState(false);

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
      await fetchData("/user/edit/name", "POST", {
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

  const profileImgChange = async (e: React.FormEvent) => {
    e.preventDefault();

    const fileInput = fileInputRef.current;
    if (fileInput && fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "profile");
      formData.append("oldImageUrl", userInfo?.profile_url || "");

      try {
        const response = await fetchData(
          "/upload-img-in-bucket",
          "POST",
          formData,
          true
        );

        const profileUrl = response.url;

        await fetchData("/user/edit/profile", "POST", {
          userId: userInfo?.userId,
          profileUrl,
        });

        toast.success("Profile image updated successfully!");
        setIsEditProfileImg(false);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    } else {
      console.error("No file selected");
    }
  };

  return (
    <Wrapper>
      {userInfo ? (
        <div className="flex flex-col justify-between h-full">
          <div>
            <div
              style={{
                background:
                  "linear-gradient(to right bottom, #D9E6FF 0%, #F6F6F6 100%)",
              }}
              className="drop-shadow-[0.3rem_0.3rem_1.3rem_rgba(54,51,105,0.1)] mx-20 mt-30 mb-11 pl-20 pr-43 py-24 rounded-[2rem] border border-gray2 bg-white"
            >
              <div className="flex items-center gap-20">
                <div>
                  <form className="relative" onSubmit={profileImgChange}>
                    <div
                      style={{
                        backgroundImage: `url(${
                          previewImg ||
                          userInfo?.profile_url ||
                          UserDefaultIcon.src
                        })`,
                      }}
                      className="aspect-square w-100 bg-no-repeat bg-cover bg-center rounded-full"
                    />
                    {isEditProfileImg ? (
                      <Button
                        className="absolute bottom-0 right-0 p-0"
                        type="submit"
                      >
                        <ImgComponent imgSrc={ProfileConfirmIcon} />
                      </Button>
                    ) : (
                      <Label
                        htmlFor="profile"
                        className="absolute bottom-0 right-0 p-0"
                      >
                        <ImgComponent imgSrc={ProfileEditIcon} />
                      </Label>
                    )}
                    <Input
                      id="profile"
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setPreviewImg(URL.createObjectURL(file));
                          setIsEditProfileImg(true);
                        } else {
                          setPreviewImg("");
                        }
                      }}
                    />
                  </form>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex items-center gap-6">
                    {isEditName ? (
                      <form
                        className="flex items-center gap-3"
                        onSubmit={nameChange}
                      >
                        <Input
                          value={userName}
                          className="min-w-100 max-w-150 h-[2.4rem] p-10 rounded-md"
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
                    <div
                      className="cursor-pointer"
                      onClick={() => setIsEditName((prev) => !prev)}
                    >
                      <ImgComponent imgSrc={EditIcon} />
                    </div>
                  </div>
                  <div className="text-[0.8rem] text-gray1">
                    {userInfo.email}
                  </div>
                  <div className="grid grid-cols-1 gap-7 mt-14">
                    <div className="flex flex-col bg-white p-8 rounded-[1rem] font-medium">
                      <div className="flex gap-2 text-[1.2rem] border-b border-[rgb(97 127 179 / 30%)] pb-4">
                        <ImgComponent imgSrc={PointIcon} />
                        <div className="pl-4 text-[#256BD5]">Point</div>
                      </div>
                      <div className="mt-4 text-[2.8rem] text-center text-[#256BD5]">
                        {commaNumber(userInfo.yatPoint)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-10 mt-10 text-white text-[0.8rem]">
                <Button
                  onClick={async () => await openWidgetSDK()}
                  className="bg-[#D9DDE1] px-8 py-4 rounded-full border border-white"
                >
                  Open Wallet
                </Button>
                <Button
                  onClick={logout}
                  className="flex items-center gap-2 bg-[#D9DDE1] px-8 py-4 rounded-full border border-white"
                >
                  <ImgComponent imgSrc={LogoutIcon} />
                  Logout
                </Button>
              </div>
            </div>
            <div className="flex justify-center w-full my-20 ">
              <Link
                href="/participate"
                className="relative bg-white text-blue text-[1.4rem] px-1 py-1 rounded-full border border-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(#f4f5f7, #f4f5f7), linear-gradient(to right bottom, #007DFE 0%, #04C7DB 100%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                }}
              >
                <div className="flex items-center gap-4 px-15 py-10">
                  <ImgComponent imgSrc={ArrowIcon} />
                  Participate Event
                </div>
              </Link>
            </div>
            <div>
              <div className="mx-20 mt-20 mb-10 text-[2rem] font-normal">
                Participate list
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
        </div>
      ) : (
        <div>null</div>
      )}
    </Wrapper>
  );
}

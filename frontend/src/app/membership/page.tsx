"use client";

import FirstTierLogo from "@/assets/Membership/FirstTierLogo.svg";
import LifeTimeLogo from "@/assets/Membership/LifeTimeLogo.svg";
import ImgComponent from "@/components/Image";
import MoonPayWidgetForMembership from "@/components/MoonPayWidgetForMembership";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Wrapper from "@/components/Wrapper";
import { selectUserInfo } from "@/lib/features/wepin/loginSlice";
import { useAppSelector } from "@/lib/hooks";
import { commaNumber } from "@/lib/utils";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { plusUserPoint } from "../actions/user";

export default function Membership() {
  const userInfo = useAppSelector(selectUserInfo);

  const [membershipTier, setMembershipTier] = useState("1");
  const [membership, setMembership] = useState<
    | {
        id: number;
        title: string;
        description: string;
        tags: string[];
        contents: string[];
        price: number;
        denom: string;
        point: number;
        img: string;
        background: string;
      }
    | undefined
  >();

  const memberships = useMemo(() => {
    return [
      {
        id: 1,
        title: "First Tier Members",
        description:
          "Exclusive access granted to the FIRST 16 founding members of YaT CLUB",
        tags: ["Monthly Party", "Priority Booking", "Private Discounts"],
        contents: [
          "15 Members",
          "+ 1 Guest Includeds",
          "9 Yacht Parties in 9 Months",
          "$YAT Payback Returns",
          "Lounge at the Dock",
          "Food / Drinks Included",
          "Only at 2.5M $YAT",
        ],
        price: 2300,
        denom: "USD",
        point: 2500000,
        img: FirstTierLogo,
        background: "linear-gradient(to right bottom, #88D9FF 0%, #1C74F9 83%)",
      },
      {
        id: 2,
        title: "Life Time Members",
        description:
          "A special membership fot $YAT HOLDERS, crafted for the crypto-native community.",
        tags: ["Staking", "Global yacht", "Lifestyle benefits"],
        contents: [
          "15 Members",
          "+ 1 Guest Includeds",
          "9 Yacht Parties in 9 Months",
          "$YAT Payback Returns",
          "Lounge at the Dock",
          "Food / Drinks Included",
          "Only at 2.5M $YAT",
        ],
        price: 10000000,
        denom: "YAT",
        point: 12000000,
        img: LifeTimeLogo,
        background: "linear-gradient(to right bottom, #88D9FF 0%, #4537FF 83%)",
      },
    ];
  }, []);

  const booking = async () => {
    try {
      if (userInfo && membership) {
        await plusUserPoint(userInfo.id, membership.point);

        toast.success("Success!");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast(err.message);
      } else {
        toast("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    setMembership(
      memberships.find((membership) => String(membership.id) === membershipTier)
    );
  }, [membershipTier, memberships]);

  return (
    <Wrapper>
      <div className="mt-20">
        <div className="flex items-center mx-20 my-10 text-[2rem] font-normal">
          Membership
        </div>
        <Tabs defaultValue="1">
          <div className="w-full border-b">
            <TabsList className="mx-20">
              <TabsTrigger
                className={clsx(
                  membershipTier === "1" && "rounded-none text-blue",
                  "relative shadow-none! px-12 py-10"
                )}
                value="1"
                onClick={() => setMembershipTier("1")}
              >
                {membershipTier === "1" && (
                  <div className="absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-[#02BEFE] to-[#1C74F9]"></div>
                )}
                First Tier
              </TabsTrigger>
              <TabsTrigger
                className={clsx(
                  membershipTier === "2" && "rounded-none text-blue",
                  "relative shadow-none! px-12 py-10"
                )}
                value="2"
                onClick={() => setMembershipTier("2")}
              >
                {membershipTier === "2" && (
                  <div className="absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-[#02BEFE] to-[#1C74F9]"></div>
                )}
                Life Time
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="mx-54 my-20">
            <div
              className="relative text-[1.6rem] px-1 py-1 mb-10 rounded-full border border-transparent font-normal text-center"
              style={{
                backgroundImage:
                  "linear-gradient(#f4f5f7, #f4f5f7), linear-gradient(to right bottom, #007DFE 0%, #04C7DB 100%)",
                backgroundOrigin: "border-box",
                backgroundClip: "content-box, border-box",
              }}
            >
              <div
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(to right bottom, #007DFE 0%, #04C7DB 100%)",
                }}
              >
                <div className="py-8">{membership?.title}</div>
              </div>
            </div>
            <div
              style={{
                background: membership?.background,
              }}
              className="rounded-[1.2rem] py-17 text-white"
            >
              <div className="flex flex-col gap-9 px-40 pb-19 mb-13 border-b border-dashed border-[#7cb0fc]">
                <ImgComponent imgSrc={membership?.img || ""} />
                <div className="mb-10 text-[1rem]">
                  {membership?.description}
                </div>
                <div className="flex items-center gap-2">
                  {membership?.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className="bg-[#d9e9ff] rounded-full px-4 py-2 text-blue text-[0.6rem]"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 mb-7">
                  {membership?.contents.map((content, idx) => (
                    <div key={`${content}-${idx}`} className="text-[0.8rem]">
                      {content}
                    </div>
                  ))}
                </div>
                <div className="text-[1.6rem]">
                  Price:{" "}
                  <span className="text-normal">
                    {commaNumber(membership?.price || "")} $ {membership?.denom}
                  </span>
                </div>
                <div className="text-[1.6rem]">
                  Point:{" "}
                  <span className="text-normal">
                    {commaNumber(membership?.point || "")}
                  </span>
                </div>
              </div>
              <MoonPayWidgetForMembership
                price={membership?.price.toString() || ""}
                token="eth"
                address="0x791631270d994c556E263E3bc9C5B2CA7B9d4758"
                onPurchaseComplete={booking}
              />
            </div>
          </div>
        </Tabs>
      </div>
    </Wrapper>
  );
}

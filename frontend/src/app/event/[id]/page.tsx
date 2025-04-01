"use client";

import EditIcon from "@/assets/common/EditIcon.svg";
import ArrowIcon from "@/assets/EventDetail/ArrowIcon.svg";
import CalendarIcon from "@/assets/EventDetail/CalendarIcon.svg";
import DollarIcon from "@/assets/EventDetail/DollarIcon.svg";
import FileIcon from "@/assets/EventDetail/FileIcon.svg";
import LockIcon from "@/assets/EventDetail/LockIcon.svg";
import UsersIcon from "@/assets/EventDetail/UsersIcon.svg";
import ImgComponent from "@/components/Image";
import MoonPayWidget from "@/components/MoonPayWidget";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Wrapper from "@/components/Wrapper";
import { selectUserInfo } from "@/lib/features/wepin/loginSlice";
import fetchData from "@/lib/fetchData";
import { useAppSelector } from "@/lib/hooks";
import { commaNumber } from "@/lib/utils";
import { EventType } from "@/types/eventType";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventDetail() {
  const { id } = useParams();

  const userInfo = useAppSelector(selectUserInfo);

  const [event, setEvents] = useState<EventType>();
  const [reservation, setReservation] = useState();

  const callEventDetail = useCallback(async () => {
    const event = await fetchData("/event", "POST", {
      id,
    });

    const reserve = await fetchData("/reservation", "POST", {
      id,
      userId: userInfo?.id,
    });

    setEvents(event);
    setReservation(reserve);
  }, [id, userInfo?.id]);

  const booking = async () => {
    try {
      if (userInfo && event) {
        const payMethod = event.point_cost ? "point" : "token";

        if (event.point_cost) {
          await fetchData("/user/edit/point", "POST", {
            userId: userInfo.id,
            point: event.point_cost,
          });
        }

        await fetchData("/booking", "POST", {
          userId: userInfo.id,
          eventId: id,
          payMethod,
        });

        callEventDetail();
        toast("Reservation!");
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
    callEventDetail();
  }, [callEventDetail]);

  return (
    <Wrapper>
      <div className="mx-20 mt-20">
        <div className="flex items-center justify-between my-10 text-[2rem] font-normal">
          Event Detail
          <div className="flex items-center gap-10">
            <Link
              href={`/participate/${id}`}
              className="text-[1.2rem] font-medium"
            >
              All Guest
            </Link>
            {event?.owner_id === userInfo?.id && (
              <div>
                <ImgComponent imgSrc={EditIcon} />
              </div>
            )}
          </div>
        </div>
        {event ? (
          <div className="flex flex-col gap-20">
            <ImgComponent
              imgSrc={event.image_url}
              width={500}
              height={500}
              className="rounded-[2rem] mt-20"
            />
            <div className="flex flex-col items-center">
              <div className="text-center mb-20 text-[3.2rem] font-normal">
                {event.title}
              </div>
              <div
                style={{
                  background:
                    "linear-gradient(to right bottom, #ffffff 0%, #f0f7ff 100%)",
                }}
                className="flex flex-col gap-17 w-full p-20 border rounded-xl border-gray4"
              >
                <div className="flex items-center">
                  <ImgComponent
                    imgSrc={CalendarIcon}
                    className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                  />
                  <div className="text-[1.4rem] font-normal">
                    {dayjs(event.start_at).format("MMM, D, YYYY (HH:mm)")}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <ImgComponent
                      imgSrc={FileIcon}
                      className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                    />
                    <div className="text-[1.2rem] font-normal text-[#475569]">
                      Description
                    </div>
                  </div>
                  <div className="mt-7 text-[1rem] font-normal">
                    {event.description}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <ImgComponent
                      imgSrc={FileIcon}
                      className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                    />
                    <div className="text-[1.2rem] font-normal text-[#475569]">
                      Location
                    </div>
                  </div>
                  <div className="mt-7 text-[1rem] font-normal">
                    {event.location}
                  </div>
                </div>
                <div className="flex items-center">
                  <ImgComponent
                    imgSrc={LockIcon}
                    className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                  />
                  <div className="text-[1.4rem] font-normal">
                    {event.is_private ? "Private" : "Public"}
                  </div>
                </div>
                <div className="flex items-center">
                  <ImgComponent
                    imgSrc={DollarIcon}
                    className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                  />
                  <div className="text-[1.4rem] font-normal">
                    {!event.point_cost && (
                      <span className="mr-8 text-[1.2rem] text-[#475569]">
                        Price
                      </span>
                    )}
                    {event.point_cost
                      ? `${commaNumber(event.point_cost)} Point`
                      : commaNumber(event.price)}
                  </div>
                </div>
                <div className="flex items-center">
                  <ImgComponent
                    imgSrc={UsersIcon}
                    className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                  />
                  <div className="text-[1.4rem] font-normal">
                    <span className="mr-8 text-[1.2rem] text-[#475569]">
                      Number of Guests
                    </span>
                    {event.reservation_count} / {event.max_participants}
                  </div>
                </div>
              </div>
            </div>
            {userInfo && !reservation && (
              <div>
                {event.point_cost ? (
                  <Drawer>
                    <DrawerTrigger
                      style={{
                        background:
                          "linear-gradient(to right bottom, #007dfe 0%, #04c7db 100%)",
                      }}
                      disabled={event.point_cost > userInfo.yatPoint}
                      className="flex items-center justify-center w-full py-10 rounded-xl text-white"
                    >
                      <ImgComponent imgSrc={ArrowIcon} className="mr-8" />
                      Reserve
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Buy with point</DrawerTitle>
                        <DrawerDescription>
                          <div>Your point: {userInfo.yatPoint}</div>
                          <div>Use point: {event.point_cost}</div>
                          <div>
                            Rest point: {userInfo.yatPoint - event.point_cost}
                          </div>
                          <div>Really?</div>
                        </DrawerDescription>
                      </DrawerHeader>
                      <DrawerFooter className="grid grid-cols-2 gap-8">
                        <Button
                          className="bg-sky-blue text-blue"
                          onClick={booking}
                        >
                          Buy
                        </Button>
                        <DrawerClose>
                          <Button className="w-full bg-sky-red text-red">
                            Cancel
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                ) : (
                  <MoonPayWidget
                    price={event.price}
                    token={event.token_type}
                    address={event.receive_address}
                    onPurchaseComplete={booking}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div>No Event</div>
        )}
      </div>
    </Wrapper>
  );
}

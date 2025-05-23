"use client";

import { getEvent } from "@/app/actions/event";
import { getReservation, setBooking } from "@/app/actions/reservation";
import { minusUserPoint } from "@/app/actions/user";
import EditIcon from "@/assets/common/EditIcon.svg";
import ArrowIcon from "@/assets/EventDetail/ArrowIcon.svg";
import CalendarIcon from "@/assets/EventDetail/CalendarIcon.svg";
import ConfirmIcon from "@/assets/EventDetail/ConfirmIcon.svg";
import DollarIcon from "@/assets/EventDetail/DollarIcon.svg";
import FileIcon from "@/assets/EventDetail/FileIcon.svg";
import LockIcon from "@/assets/EventDetail/LockIcon.svg";
import MinusIcon from "@/assets/EventDetail/MinusIcon.svg";
import PayPointIcon from "@/assets/EventDetail/PayPointIcon.svg";
import UsersIcon from "@/assets/EventDetail/UsersIcon.svg";
import ImgComponent from "@/components/Image";
import MoonPayWidget from "@/components/MoonPayWidget";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Wrapper from "@/components/Wrapper";
import { selectUserInfo } from "@/lib/features/wepin/loginSlice";
import { useAppSelector } from "@/lib/hooks";
import { commaNumber } from "@/lib/utils";
import { EventType } from "@/types/eventType";
import { ReservationType } from "@/types/reservationType";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventDetail() {
  const { id } = useParams();

  const userInfo = useAppSelector(selectUserInfo);

  const [event, setEvents] = useState<EventType>();
  const [reservation, setReservation] = useState<ReservationType>();

  const callEventDetail = useCallback(async () => {
    if (userInfo) {
      const event = await getEvent(id);

      const reserve = await getReservation(id, userInfo.id);

      setEvents(event);
      setReservation(reserve);
    }
  }, [id, userInfo]);

  const booking = async () => {
    try {
      if (userInfo && event) {
        const payMethod = event.point_cost ? "point" : "token";

        if (event.point_cost) {
          await minusUserPoint(userInfo.id, event.point_cost);
        }

        await setBooking(userInfo.id, id, payMethod);

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
            <div
              style={{
                backgroundImage: `url(${event.image_url})`,
              }}
              className="aspect-square w-full bg-no-repeat bg-cover bg-center rounded-[2rem] mt-20"
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
                  <div className="bg-[#E8F1FF] p-10 rounded-r-[1rem] rounded-b-[1rem] mt-7 text-[1rem] font-normal">
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
                  <div className="bg-[#E8F1FF] p-10 rounded-r-[1rem] rounded-b-[1rem] mt-7 text-[1rem] font-normal">
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
                  <Dialog>
                    <DialogTrigger className="w-full h-fit">
                      <Button
                        style={{
                          background:
                            "linear-gradient(to right bottom, #007dfe 0%, #04c7db 100%)",
                        }}
                        disabled={event.point_cost > userInfo.yatPoint}
                        className="flex items-center justify-center w-full py-10 rounded-xl text-white"
                      >
                        <ImgComponent imgSrc={ArrowIcon} className="mr-8" />
                        Reserve
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#eeeff3] px-20 py-40">
                      <DialogHeader>
                        <DialogTitle className="flex flex-col items-center justify-center pb-20 font-normal text-[3.2rem]">
                          Buy with point
                          <ImgComponent
                            imgSrc={PayPointIcon}
                            className="mt-16"
                          />
                        </DialogTitle>
                        <DialogDescription>
                          <div className="flex flex-col gap-16 bg-white rounded-[1rem] p-20 text-[1.6rem] font-normal">
                            <div className="grid grid-cols-[1.6rem_11rem_minmax(0,1fr)] items-center gap-10 text-black">
                              <span></span>
                              <span className="text-start">Your point</span>
                              <span className="text-start">
                                {userInfo.yatPoint}
                              </span>
                            </div>
                            <div className="grid grid-cols-[1.6rem_11rem_minmax(0,1fr)] items-center gap-10 text-blue">
                              <span>
                                <ImgComponent imgSrc={MinusIcon} />
                              </span>
                              <span className="text-start">Use point</span>
                              <span className="text-start">
                                {event.point_cost}
                              </span>
                            </div>
                            <div className="grid grid-cols-[13.6rem_minmax(0,1fr)] items-center gap-10 border-t border-dashed pt-16 text-[2rem] text-brand">
                              <span className="text-start">Rest point</span>
                              <span className="text-start">
                                {userInfo.yatPoint - event.point_cost}
                              </span>
                            </div>
                          </div>
                          <Button
                            className="flex items-center gap-8 w-full bg-brand mt-20 py-14 rounded-[1.4rem] text-white text-center text-[1.6rem]"
                            onClick={booking}
                          >
                            <ImgComponent imgSrc={ConfirmIcon} />
                            Buy
                          </Button>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
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

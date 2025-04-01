"use client";

import QrcodeIcon from "@/assets/common/QrcodeIcon.svg";
import CalendarIcon from "@/assets/EventDetail/CalendarIcon.svg";
import LockIcon from "@/assets/EventDetail/LockIcon.svg";
import ProfileLogo from "@/assets/Header/ProfileLogo.svg";
import RightCheckIcon from "@/assets/Participate/RightCheckIcon.svg";
import ImgComponent from "@/components/Image";
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
import fetchData from "@/lib/fetchData";
import { useAppSelector } from "@/lib/hooks";
import { ReservationType } from "@/types/reservationType";
import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventDetail() {
  const userInfo = useAppSelector(selectUserInfo);

  const [reservations, setReservations] = useState<ReservationType[]>([]);

  useEffect(() => {
    const init = async () => {
      const events = await fetchData("/reservations", "POST", {
        userId: userInfo?.id,
      });

      setReservations(events);
    };

    init();
  }, [userInfo]);

  return (
    <Wrapper>
      <div className="mx-20 mt-20">
        <div className="flex flex-col gap-20 my-10 text-[2rem] font-normal">
          {reservations.map((reservation) => {
            const status = () => {
              if (reservation.reservation_status === "completed") {
                return "Registration completed";
              }

              return "Registration rejected";
            };

            return (
              <div
                key={reservation.reservation_id}
                style={{
                  background:
                    "linear-gradient(to right bottom, #ffffff 0%, #f0f7ff 100%)",
                }}
                className="flex flex-col gap-17 w-full p-20 border rounded-xl border-gray4"
              >
                <div className="flex justify-between">
                  <ImgComponent
                    imgSrc={reservation.event_image_url}
                    width={200}
                    height={200}
                    className="w-80! h-80! rounded-xl"
                  />
                  {reservation.reservation_status === "confirmed" ? (
                    <Dialog>
                      <DialogTrigger className="h-fit">
                        <ImgComponent imgSrc={QrcodeIcon} />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex flex-col items-center justify-center text-[#5299FF]">
                            {reservation.event_title}
                            <div className="bg-black w-200 h-200 my-20"></div>
                          </DialogTitle>
                          <DialogDescription className="pt-20 border-t border-dashed">
                            <div className="flex items-center gap-16 mx-15">
                              <ImgComponent
                                imgSrc={ProfileLogo}
                                className="w-48! h-48!"
                              />
                              <div className="text-[1.8rem] text-[#5A5D61] text-start">
                                {userInfo?.name}
                                <div className="mt-2 text-[1.4rem] text-gray1">
                                  {userInfo?.email}
                                </div>
                              </div>
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <div
                      className={clsx(
                        reservation.reservation_status === "completed"
                          ? "bg-mid-blue text-blue"
                          : "bg-sky-red text-red",
                        "flex items-center gap-3 h-fit rounded-full px-6 py-4 text-[0.8rem]"
                      )}
                    >
                      <ImgComponent
                        imgSrc={
                          reservation.reservation_status === "completed"
                            ? RightCheckIcon
                            : RightCheckIcon
                        }
                      />
                      {status()}
                    </div>
                  )}
                </div>
                <Link
                  href={`/event/${reservation.event_id}`}
                  className="text-[1.6rem] font-medium"
                >
                  {reservation.event_title}
                </Link>
                <div className="flex items-center">
                  <ImgComponent
                    imgSrc={CalendarIcon}
                    className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                  />
                  <div className="text-[1.4rem] font-normal">
                    {dayjs(reservation.event_start_at).format(
                      "MMM, D, YYYY (HH:mm)"
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center">
                    <ImgComponent
                      imgSrc={CalendarIcon}
                      className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                    />
                    <div className="text-[1.2rem] font-normal text-[#475569]">
                      Location
                    </div>
                  </div>
                  <div className="mt-7 text-[1rem] font-normal">
                    {reservation.event_location}
                  </div>
                </div>
                <div className="flex items-center">
                  <ImgComponent
                    imgSrc={LockIcon}
                    className="mr-8 p-6 border border-#EFF3F6 rounded-lg"
                  />
                  <div className="text-[1.4rem] font-normal">
                    {reservation.event_is_private ? "Private" : "Public"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}

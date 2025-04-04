"use client";

import CalendarIcon from "@/assets/EventCreate/CalendarIcon.svg";
import LocationIcon from "@/assets/EventCreate/LocationIcon.svg";
import UsersIcon from "@/assets/EventCreate/UsersIcon.svg";
import UserDefaultIcon from "@/assets/Mypage/UserDefaultIcon.svg";
import CheckIcon from "@/assets/Participate/CheckIcon.svg";
import CorrectIcon from "@/assets/Participate/CorrectIcon.svg";
import IncorrectIcon from "@/assets/Participate/IncorrectIcon.svg";
import ImgComponent from "@/components/Image";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { selectUserInfo } from "@/lib/features/wepin/loginSlice";
import fetchData from "@/lib/fetchData";
import { useAppSelector } from "@/lib/hooks";
import { EventType } from "@/types/eventType";
import { ReservationForUserType } from "@/types/reservationType";
import clsx from "clsx";
import dayjs from "dayjs";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useParams } from "next/navigation";
import { isEmpty } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function ParticipateDetail() {
  const { id } = useParams();

  const userInfo = useAppSelector(selectUserInfo);

  const [isScanning, setIsScanning] = useState(false);
  const [event, setEvents] = useState<EventType>();
  const [reservations, setReservations] = useState<ReservationForUserType[]>(
    []
  );

  const callEventDetail = useCallback(async () => {
    const event = await fetchData("/event", "POST", {
      id,
    });

    const reservations = await fetchData("/own/reservation", "POST", {
      eventId: event.id,
    });

    setEvents(event);
    setReservations(reservations);
  }, [id]);

  const handleReservation = async (
    id: string,
    userId: string,
    status: "confirmed" | "rejected" | "completed"
  ) => {
    await fetchData("/reservation/edit-status", "POST", {
      id,
      userId,
      status,
    });
  };

  useEffect(() => {
    callEventDetail();
  }, [callEventDetail]);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (isScanning) {
      scanner = new Html5QrcodeScanner(
        "reader",
        {
          qrbox: {
            width: 250,
            height: 250,
          },
          fps: 5,
        },
        false
      );

      scanner.render(
        (result) => {
          try {
            scanner?.clear();
            const values = result.split("-");
            handleReservation(values[0], values[1], "completed");
            setIsScanning(false);

            toast.success("QR code scanned successfully!");
            callEventDetail();
          } catch (err) {
            console.error(err);
          }
        },
        (err) => {
          console.warn(err);
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [callEventDetail, isScanning]);

  if (!id || !event) {
    return;
  }

  return (
    <Wrapper>
      <div className="mx-20 mt-20">
        <div className="flex items-center justify-between my-10 text-[2rem] font-normal">
          {event.owner_id === userInfo?.id ? "My event" : "Participate event"}
          {event.owner_id === userInfo?.id && (
            <div>
              {!isScanning ? (
                <Button
                  onClick={() => setIsScanning(true)}
                  className="px-6 py-5 border border-[#87B8FF] rounded-[0.8rem] text-[1rem] text-[#87B8FF]"
                >
                  QR Scan
                </Button>
              ) : (
                <Button
                  onClick={() => setIsScanning(false)}
                  className="px-6 py-5 border border-red-500 rounded-[0.8rem] text-[1rem] text-red-500"
                >
                  Stop Scanning
                </Button>
              )}
            </div>
          )}
        </div>
        {isScanning && (
          <div
            className="absolute! top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%]"
            id="reader"
          ></div>
        )}
        <div className="flex items-center gap-16 mt-10 mb-20 p-12 border border-gray2 rounded-[2rem]">
          <ImgComponent
            imgSrc={event.image_url}
            width={500}
            height={500}
            className="w-90! h-90! rounded-[1.2rem]"
          />
          <div>
            <div className="mb-10 text-[1.8rem] font-medium">{event.title}</div>
            <div className="flex flex-col gap-6 text-[1rem]">
              <div className="flex items-center gap-3">
                <ImgComponent imgSrc={CalendarIcon} />
                {dayjs(event.start_at).format("MMM, D, YYYY (HH:mm)")}
              </div>
              <div className="flex items-center gap-3">
                <ImgComponent imgSrc={LocationIcon} />
                {event.location}
              </div>
              <div className="flex items-center gap-3">
                <ImgComponent imgSrc={UsersIcon} />
                {event.reservation_count} / {event.max_participants}
              </div>
            </div>
          </div>
        </div>
        <div className="my-10 text-[2rem] font-normal">Guest list</div>
        <div>
          {isEmpty(reservations) ? (
            <div className="flex items-center justify-center w-full h-[20rem] text-[1.4rem] font-normal">
              No guests yet.
            </div>
          ) : (
            reservations.map((reservation) => {
              const status = () => {
                if (reservation.reservation_status === "completed") {
                  return {
                    label: "Complete",
                    bgColor: "bg-mid-blue",
                    textColor: "text-blue",
                    img: CorrectIcon,
                  };
                } else if (reservation.reservation_status === "confirmed") {
                  return {
                    label: "Confirm",
                    bgColor: "bg-sky-green",
                    textColor: "text-green",
                    img: CheckIcon,
                  };
                }

                return {
                  label: "Reject",
                  bgColor: "bg-sky-red",
                  textColor: "text-red",
                  img: IncorrectIcon,
                };
              };

              return (
                <div
                  key={reservation.reservation_id}
                  className="flex items-center justify-between px-10 py-8 border border-[#D9D9D9] rounded-[1rem]"
                >
                  <div className="flex items-center">
                    <ImgComponent
                      imgSrc={UserDefaultIcon}
                      className="w-36! h-36! mr-9 text-[#2B3F5D]"
                    />
                    <div>
                      <div className="text-[1.2rem]">
                        {reservation.user_name}
                      </div>
                      <div className="mt-4 text-[0.8rem]">
                        {reservation.user_email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={clsx(
                        status().bgColor,
                        status().textColor,
                        "flex items-center rounded-full px-7 py-3 text-[0.8rem]"
                      )}
                    >
                      {status().label}
                      <ImgComponent imgSrc={status().img} className="ml-3" />
                    </div>
                    {event.owner_id === userInfo?.id &&
                      reservation.reservation_status === "confirmed" && (
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => {
                              handleReservation(
                                String(reservation.reservation_id),
                                reservation.user_userId,
                                "rejected"
                              );
                              callEventDetail();
                            }}
                          >
                            <ImgComponent
                              imgSrc={IncorrectIcon}
                              className="bg-bg-sky-red ml-5"
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Wrapper>
  );
}

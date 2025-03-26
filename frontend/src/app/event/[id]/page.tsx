"use client";

import ImgComponent from "@/components/Image";
import MoonPayWidget from "@/components/MoonPayWidget";
import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import { selectUserInfo } from "@/lib/features/wepin/loginSlice";
import fetchData from "@/lib/fetchData";
import { useAppSelector } from "@/lib/hooks";
import { EventType } from "@/types/eventType";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EventDetail() {
  const { id } = useParams();

  const userInfo = useAppSelector(selectUserInfo);

  const [event, setEvents] = useState<EventType>();
  const [reservation, setReservation] = useState();
  const [payMethod, setPayMethod] = useState("token");

  useEffect(() => {
    const init = async () => {
      const event = await fetchData("/event", "POST", {
        id,
      });

      const reserve = await fetchData("/reservation", "POST", {
        id,
        userId: userInfo?.id,
      });

      setEvents(event);
      setReservation(reserve);
    };

    init();
  }, [id, userInfo]);

  const booking = async () => {
    try {
      if (userInfo) {
        await fetchData("/booking", "POST", {
          userId: userInfo.id,
          eventId: id,
          payMethod,
        });

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

  return (
    <Wrapper>
      <div className="mx-20">
        {event ? (
          <div>
            <div className="flex flex-col gap-3">
              {event.title}
              <div>{event.description}</div>
              <ImgComponent imgSrc={event.image_url} width={500} height={500} />
              <div>Location: {event.location}</div>
              <div>Total Participants: {event.max_participants}</div>
              <div>
                <Button onClick={() => setPayMethod("token")}>Token</Button>
                <Button onClick={() => setPayMethod("point")}>Point</Button>
              </div>
              {payMethod === "token" ? (
                <>
                  <div>Price: {event.price}</div>
                  <div>Token Denom: {event.token_type}</div>
                </>
              ) : (
                <div>Point: {event.point_cost}</div>
              )}
              <div>
                Start Date: {dayjs(event.start_at).format("MMM D YYYY")}
              </div>
            </div>
            {userInfo && !reservation && (
              <MoonPayWidget
                price={event.price}
                token={event.token_type}
                address={event.receive_address}
                onPurchaseComplete={booking}
              />
            )}
          </div>
        ) : (
          <div>No Event</div>
        )}
      </div>
    </Wrapper>
  );
}

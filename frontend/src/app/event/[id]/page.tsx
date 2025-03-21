"use client";

import MoonPayWidget from "@/components/MoonPayWidget";
import Wrapper from "@/components/Wrapper/Wrapper";
import fetchData from "@/lib/fetchData";
import { EventType } from "@/types/eventType";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EventDetail() {
  const { id } = useParams();

  const [event, setEvents] = useState<EventType>();

  useEffect(() => {
    const init = async () => {
      const findUser = await fetchData("/event", "POST", {
        id,
      });

      setEvents(findUser);
    };

    init();
  }, [id]);

  return (
    <Wrapper>
      {event ? (
        <div>
          <div className="flex flex-col gap-3">
            {event.title}
            <div>{event.description}</div>
          </div>
          <MoonPayWidget
            price={event.price}
            token={event.token_type}
            address={event.receive_address}
            onPurchaseComplete={async () => alert("SUCCESS!!!")}
          />
        </div>
      ) : (
        <div>No Event</div>
      )}
    </Wrapper>
  );
}

"use client";

import EventList from "@/components/EventList";
import Wrapper from "@/components/Wrapper";
import fetchData from "@/lib/fetchData";
import { division } from "@/lib/utils";
import { ParseEventType } from "@/types/eventType";
import { useEffect, useState } from "react";

export default function Home() {
  const [isPast, setIsPast] = useState(false);
  const [events, setEvents] = useState<ParseEventType>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const init = async () => {
      const events = await fetchData("/events", "POST", {
        isPast,
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
  }, [isPast]);

  return (
    <Wrapper>
      <div className="mt-20">
        <EventList
          isPast={isPast}
          setIsPast={setIsPast}
          page={page}
          setPage={setPage}
          events={events}
          isMain
        />
      </div>
    </Wrapper>
  );
}

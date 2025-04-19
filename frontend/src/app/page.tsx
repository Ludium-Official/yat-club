"use client";

import EventList from "@/components/EventList";
import Wrapper from "@/components/Wrapper";
import { division } from "@/lib/utils";
import { ParseEventType } from "@/types/eventType";
import { useEffect, useState } from "react";
import { getEvents } from "./actions/event";

export default function Home() {
  const [isPast, setIsPast] = useState(false);
  const [events, setEvents] = useState<ParseEventType>();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const init = async () => {
      const events = await getEvents(isPast);

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

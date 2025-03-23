"use client";

import { Button } from "@/components/ui/button";
import Wrapper from "@/components/Wrapper";
import fetchData from "@/lib/fetchData";
import { EventType } from "@/types/eventType";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isPast, setIsPast] = useState(false);
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    const init = async () => {
      const events = await fetchData("/events", "POST", {
        isPast,
      });

      setEvents(events);
    };

    init();
  }, [isPast]);

  return (
    <Wrapper>
      <div className="mt-10">
        <Button onClick={() => setIsPast((prev) => !prev)}>Change</Button>
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <Link key={event.id} href={`/event/${event.id}`}>
              {event.title}
            </Link>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

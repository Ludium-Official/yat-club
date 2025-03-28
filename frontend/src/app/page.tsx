"use client";

import CalendarIcon from "@/assets/Main/CalendarIcon.svg";
import UsersIcon from "@/assets/Main/UsersIcon.svg";
import ImgComponent from "@/components/Image";
import PaginationComp from "@/components/Pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Wrapper from "@/components/Wrapper";
import fetchData from "@/lib/fetchData";
import { division } from "@/lib/utils";
import { EventType } from "@/types/eventType";
import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface EventProps {
  event: EventType[][];
  totalEvent: number;
}

export default function Home() {
  const [isPast, setIsPast] = useState(false);
  const [events, setEvents] = useState<EventProps>();
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
      <div className="mt-10">
        <Tabs defaultValue="upcoming">
          <div className="w-full border-b">
            <TabsList className="mx-20">
              <TabsTrigger
                className={clsx(
                  !isPast && "rounded-none text-blue",
                  "relative shadow-none! px-12 py-10"
                )}
                value="upcoming"
                onClick={() => setIsPast(false)}
              >
                <div className="absolute bottom-35">
                  <div
                    style={{
                      background:
                        "linear-gradient(to right bottom, #007dfe 0%, #04c7db 100%)",
                    }}
                    className="relative px-12 py-3 rounded-full bg-background text-[1rem] text-white"
                  >
                    HOT
                    <div className="z-[-1] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[0.8rem] border-r-[0.8rem] border-t-[0.8rem] border-solid border-t-[#04c7db] border-l-transparent border-r-transparent"></div>
                  </div>
                </div>
                {!isPast && (
                  <div className="absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-[#02BEFE] to-[#1C74F9]"></div>
                )}
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                className={clsx(
                  isPast && "rounded-none text-blue",
                  "relative shadow-none! px-12 py-10"
                )}
                value="past"
                onClick={() => setIsPast(true)}
              >
                {isPast && (
                  <div className="absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-[#02BEFE] to-[#1C74F9]"></div>
                )}
                Past
              </TabsTrigger>
            </TabsList>
          </div>
          <div>
            <div className="flex flex-col gap-8 mx-20 mt-24 mb-8">
              {events?.event[page - 1]?.map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="flex items-center gap-16 p-12 rounded-[2rem] border border-[#E2E8F0] bg-white"
                >
                  <div
                    style={{
                      backgroundImage: `url(${event.image_url})`,
                    }}
                    className="w-80 h-80 bg-no-repeat bg-cover bg-center rounded-xl"
                  />
                  <div>
                    <div className="font-bold text-[1.8rem]">{event.title}</div>
                    <div className="flex flex-col gap-6 mt-14 text-[1.2rem]">
                      <div className="flex items-center gap-8">
                        <ImgComponent imgSrc={CalendarIcon.src} />
                        <div>
                          {dayjs(event.start_at).format("MMM D YYYY HH:mm")}
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <ImgComponent imgSrc={UsersIcon.src} />
                        <div className="text-sky-blue">
                          {event.reservation_count}/{event.max_participants}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <PaginationComp
              totalCount={events?.totalEvent || 0}
              page={page}
              setPage={setPage}
            />
          </div>
        </Tabs>
      </div>
    </Wrapper>
  );
}

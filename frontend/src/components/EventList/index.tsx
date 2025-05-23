import CalendarIcon from "@/assets/EventCreate/CalendarIcon.svg";
import LocationIcon from "@/assets/EventCreate/LocationIcon.svg";
import UsersIcon from "@/assets/Main/UsersIcon.svg";
import PaginationComp from "@/components/Pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParseEventType } from "@/types/eventType";
import clsx from "clsx";
import dayjs from "dayjs";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import ImgComponent from "../Image";

interface IEventListProps {
  isPast: boolean;
  setIsPast: Dispatch<SetStateAction<boolean>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  events?: ParseEventType;
  isMain?: boolean;
}

const EventList: React.FC<IEventListProps> = ({
  isPast,
  setIsPast,
  page,
  setPage,
  events,
  isMain = false,
}) => {
  return (
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
            {isMain && (
              <div className="absolute bottom-35">
                <div className="relative">
                  <div
                    style={{
                      background:
                        "linear-gradient(to right bottom, #007dfe 0%, #04c7db 100%)",
                    }}
                    className="relative z-2 px-12 py-3 rounded-full text-[1rem] text-white"
                  >
                    HOT
                  </div>
                  <div className="z-1 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[0.8rem] border-r-[0.8rem] border-t-[0.8rem] border-solid border-t-[#04c7db] border-l-transparent border-r-transparent"></div>
                </div>
              </div>
            )}
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
          {events?.event[page - 1]?.map((event) => {
            return (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="grid grid-cols-[9rem_minmax(0,1fr)] gap-16 p-12 rounded-[2rem] border border-gray3 bg-white"
              >
                <div
                  style={{
                    backgroundImage: `url(${event.image_url})`,
                  }}
                  className="w-90 h-90 bg-no-repeat bg-cover bg-center rounded-xl"
                />
                <div>
                  <div className="font-normal text-[1.8rem]">{event.title}</div>
                  <div className="flex flex-col gap-6 mt-14 text-[1.2rem]">
                    <div className="flex gap-8">
                      <ImgComponent imgSrc={CalendarIcon} />
                      <div>
                        {dayjs(event.start_at).format("MMM D YYYY HH:mm")}
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="w-15 h-15">
                        <ImgComponent
                          imgSrc={LocationIcon}
                          width={15}
                          height={15}
                          className="w-15! h-15!"
                        />
                      </div>
                      <div>{event.location}</div>
                    </div>
                    <div className="flex gap-8">
                      <ImgComponent imgSrc={UsersIcon} />
                      <div className="text-sky-blue">
                        {event.reservation_count} / {event.max_participants}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <PaginationComp
          totalCount={events?.totalEvent || 0}
          page={page}
          setPage={setPage}
        />
      </div>
    </Tabs>
  );
};

export default EventList;

"use server";

import fetchData from "@/lib/fetchData";
import { EventType } from "@/types/eventType";
import dayjs from "dayjs";
import { ParamValue } from "next/dist/server/request/params";
import { isEmpty } from "ramda";

export async function getEvent(id: ParamValue | string): Promise<EventType> {
  const response = await fetchData("/event", "POST", {
    id,
  });

  return response;
}

export async function getEvents(isPast: boolean): Promise<EventType[]> {
  const response = await fetchData("/events", "POST", {
    isPast,
  });

  return response;
}

export async function getUserEvents(
  isPast: boolean,
  userId: number
): Promise<EventType[]> {
  const response = await fetchData("/user-events", "POST", {
    isPast,
    userId,
  });

  return response;
}

export async function createEvent(
  userId: number,
  title: string,
  description: string,
  image_url: string,
  is_private: boolean,
  guests: number,
  accountRecvAddr: string,
  start_at: Date,
  location: string,
  price: number,
  target: string
) {
  if (!isEmpty(accountRecvAddr)) {
    await fetchData("/event/create", "POST", {
      userId,
      title,
      description,
      image_url,
      is_private,
      max_participants: guests,
      receive_address: accountRecvAddr,
      start_at: dayjs(start_at).format("YYYY-MM-DD HH:mm:ss"),
      location,
      price,
      target,
    });
  }
}

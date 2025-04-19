"use server";

import fetchData from "@/lib/fetchData";
import {
  ReservationForUserType,
  ReservationType,
} from "@/types/reservationType";
import { ParamValue } from "next/dist/server/request/params";

export async function getReservation(
  id: ParamValue,
  userId: number
): Promise<ReservationType> {
  const response = await fetchData("/reservation", "POST", {
    id,
    userId,
  });

  return response;
}

export async function getReservations(
  userId: number
): Promise<ReservationType[]> {
  const response = await fetchData("/reservations", "POST", {
    userId,
  });

  return response;
}

export async function getOwnReservations(
  eventId: number
): Promise<ReservationForUserType[]> {
  const response = await fetchData("/own/reservation", "POST", {
    eventId,
  });

  return response;
}

export async function setBooking(
  userId: number,
  id: ParamValue,
  payMethod: string
) {
  await fetchData("/booking", "POST", {
    userId,
    eventId: id,
    payMethod,
  });
}

export async function editStatus(
  id: ParamValue,
  userId: number | string,
  status: string
) {
  await fetchData("/reservation/edit-status", "POST", {
    id,
    userId,
    status,
  });
}

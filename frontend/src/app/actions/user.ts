"use server";

import fetchData from "@/lib/fetchData";

export async function getUser(userId: number | string) {
  const response = await fetchData("/user", "POST", {
    userId,
  });

  return response;
}

export async function minusUserPoint(userId: number, point: number) {
  fetchData("/user/minus/point", "POST", {
    userId,
    point,
  });
}

export async function plusUserPoint(userId: number, point: number) {
  fetchData("/user/add/point", "POST", {
    userId,
    point,
  });
}

export async function editUserName(userId: number | string, userName: string) {
  await fetchData("/user/edit/name", "POST", {
    userId,
    userName,
  });
}

export async function editUserProfile(userId: string, profileUrl: string) {
  await fetchData("/user/edit/profile", "POST", {
    userId,
    profileUrl,
  });
}

export async function setRegister(
  email: string,
  provider: string,
  userId: string,
  walletId: string
) {
  await fetchData("/register", "POST", {
    email,
    provider,
    userId,
    walletId,
  });
}

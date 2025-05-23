import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const division = <T>(array: T[], count: number) => {
  const length = array.length;
  const divide =
    Math.floor(length / count) + (Math.floor(length % count) > 0 ? 1 : 0);
  const newArray = [];

  for (let i = 1; i <= divide; i++) {
    newArray.push(array.splice(0, count));
  }

  return newArray;
};

export const commaNumber = (num: number | string) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

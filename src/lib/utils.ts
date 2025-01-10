import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCode() {
  return Math.random().toString(36).substring(2, 13).toUpperCase();
}

export const currencyFormat = (amount: number, currency: string = "ngn") => {
  return new Intl.NumberFormat(currency === "usd" ? "en-US" : "en-NG", {
    style: "currency",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    currency: currency,
  }).format(amount);
};

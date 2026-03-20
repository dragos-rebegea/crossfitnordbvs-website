import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { ro } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRON(amount: number): string {
  return `${amount} RON`;
}

export function formatDate(date: Date | string, formatStr: string = "d MMMM yyyy"): string {
  return format(new Date(date), formatStr, { locale: ro });
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), "HH:mm", { locale: ro });
}

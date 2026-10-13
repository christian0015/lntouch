// lib/dates.ts
import { SALON_TZ } from "@/lib/constants";

/** Date du jour "YYYY-MM-DD" dans le fuseau du salon. */
export function todayISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: SALON_TZ }).format(now);
}

/** Heure courante "HH:MM" dans le fuseau du salon. */
export function nowHHMM(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: SALON_TZ, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now);
}

export function addDaysISO(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDateFR(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(d);
}

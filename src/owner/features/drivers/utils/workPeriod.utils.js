// Ish davrlari uchun DERIVED hisob-kitoblar (muddat, holat).
// Sana solishtirishlar kun aniqligida (Tashkent kuni "YYYY-MM-DD").
import { TARIFF } from "@/shared/constants/tariffs";

const DAY_MS = 24 * 60 * 60 * 1000;

// "YYYY-MM-DD" (Tashkent, UTC+5) - brauzer TZ'siga bog'liq emas.
export const dayKey = (date) =>
  new Date(new Date(date).getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);

export const todayKey = () => dayKey(new Date());

// Davrning holati: ochiq/joriy, o'tgan yoki kelajak.
export const periodState = (period, today = todayKey()) => {
  const start = dayKey(period.startDate);
  const end = period.endDate ? dayKey(period.endDate) : null;
  if (start > today) return "future";
  if (end && end < today) return "past";
  return "active";
};

// Davrda BUGUNGACHA ishlangan kunlar soni (inclusive). Kelajak davr = 0.
export const periodDays = (period, today = todayKey()) => {
  const startK = dayKey(period.startDate);
  if (startK > today) return 0;
  const endK = period.endDate ? dayKey(period.endDate) : today;
  const effectiveEnd = endK > today ? today : endK;
  const start = new Date(`${startK}T00:00:00Z`).getTime();
  const end = new Date(`${effectiveEnd}T00:00:00Z`).getTime();
  return Math.floor((end - start) / DAY_MS) + 1;
};

export const totalDaysByTariff = (periods = []) => {
  const acc = { [TARIFF.DEPOSIT]: 0, [TARIFF.CASHBACK]: 0, total: 0 };
  for (const p of periods) {
    const days = periodDays(p);
    acc[p.tariff] = (acc[p.tariff] || 0) + days;
    acc.total += days;
  }
  return acc;
};

// Kunlar sonini "X yil Y oy Z kun" ko'rinishida (taxminiy: 1 oy ≈ 30 kun).
export const formatDuration = (days) => {
  if (!days) return "0 kun";
  const years = Math.floor(days / 365);
  let rem = days % 365;
  const months = Math.floor(rem / 30);
  rem %= 30;
  const parts = [];
  if (years) parts.push(`${years} yil`);
  if (months) parts.push(`${months} oy`);
  if (rem) parts.push(`${rem} kun`);
  return parts.join(" ") || "0 kun";
};

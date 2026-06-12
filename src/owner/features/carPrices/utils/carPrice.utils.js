// Mashina narx davrlari uchun DERIVED hisob-kitoblar (muddat, holat).
// Sana solishtirishlar kun aniqligida (Tashkent kuni "YYYY-MM-DD").
const DAY_MS = 24 * 60 * 60 * 1000;

// "YYYY-MM-DD" (Tashkent, UTC+5) - brauzer TZ'siga bog'liq emas.
export const dayKey = (date) =>
  new Date(new Date(date).getTime() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);

export const todayKey = () => dayKey(new Date());

const keyToMs = (key) => new Date(`${key}T00:00:00Z`).getTime();

// Davrning holati: ochiq/joriy, o'tgan yoki kelajak.
export const periodState = (period, today = todayKey()) => {
  const start = dayKey(period.startDate);
  const end = period.endDate ? dayKey(period.endDate) : null;
  if (start > today) return "future";
  if (end && end < today) return "past";
  return "active";
};

// Davrda BUGUNGACHA narx sozlangan kunlar soni (inclusive). Kelajak davr = 0.
export const periodDays = (period, today = todayKey()) => {
  const startK = dayKey(period.startDate);
  if (startK > today) return 0;
  const endK = period.endDate ? dayKey(period.endDate) : today;
  const effectiveEnd = endK > today ? today : endK;
  return Math.floor((keyToMs(effectiveEnd) - keyToMs(startK)) / DAY_MS) + 1;
};

// Umumiy narx sozlangan kunlar - barcha davr intervallarining BIRLASHMASI (union),
// shu sababli ustma-ust tushgan kunlar ikki marta sanalmaydi.
export const totalCoverageDays = (periods = [], today = todayKey()) => {
  const ranges = [];
  for (const p of periods) {
    const startK = dayKey(p.startDate);
    if (startK > today) continue;
    const endK = p.endDate ? dayKey(p.endDate) : today;
    const effEnd = endK > today ? today : endK;
    ranges.push([keyToMs(startK), keyToMs(effEnd)]);
  }
  if (!ranges.length) return 0;
  ranges.sort((a, b) => a[0] - b[0]);
  let days = 0;
  let [curStart, curEnd] = ranges[0];
  for (let i = 1; i < ranges.length; i += 1) {
    const [s, e] = ranges[i];
    if (s <= curEnd + DAY_MS) {
      curEnd = Math.max(curEnd, e);
    } else {
      days += Math.floor((curEnd - curStart) / DAY_MS) + 1;
      [curStart, curEnd] = [s, e];
    }
  }
  days += Math.floor((curEnd - curStart) / DAY_MS) + 1;
  return days;
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

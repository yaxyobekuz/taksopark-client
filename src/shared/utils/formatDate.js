import { formatDateUZ } from "./date.utils";

// Sana formati: "21-may, 2026" (yagona standart - date.utils.js)
export const formatDateUz = (dateLike) => formatDateUZ(dateLike);

// HTML <input type="date"> uchun YYYY-MM-DD
export const toDateInput = (dateLike) => {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

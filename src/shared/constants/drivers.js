import { TARIFF_LABELS, TARIFF_BADGE_CLASS } from "./tariffs";

// Haydovchi HOLATI ish davrlaridan DERIVED: bugun faol davri bo'lsa "Ishda"
// (joriy tarif ko'rsatiladi), bo'lmasa "Ishlamayotgan".
export const DRIVER_WORK_STATUS = Object.freeze({
  WORKING: "working",
  IDLE: "idle",
});

export const IDLE_LABEL = "Ishlamayotgan";
export const IDLE_BADGE_CLASS = "bg-gray-100 text-gray-600";

// Haydovchi uchun HOLAT belgisini (label + rang) qaytaradi.
// Ishda bo'lsa - joriy davr tarifi; aks holda "Ishlamayotgan".
export const driverStatusBadge = (driver) => {
  const tariff = driver?.currentPeriod?.tariff;
  if (tariff) {
    return {
      label: TARIFF_LABELS[tariff] || tariff,
      className: TARIFF_BADGE_CLASS[tariff] || IDLE_BADGE_CLASS,
    };
  }
  return { label: IDLE_LABEL, className: IDLE_BADGE_CLASS };
};

// "all" - barcha holatlar (query'da status yuborilmaydi)
export const DRIVER_STATUS_TAB_ALL = "all";

export const DRIVER_STATUS_TABS = [
  { value: DRIVER_STATUS_TAB_ALL, label: "Barchasi" },
  { value: DRIVER_WORK_STATUS.WORKING, label: "Ishda" },
  { value: DRIVER_WORK_STATUS.IDLE, label: "Ishlamayotgan" },
];

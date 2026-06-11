export const DRIVER_STATUS = Object.freeze({
  ACTIVE: "active",
  ARCHIVED: "archived",
});

export const DRIVER_STATUS_LABELS = Object.freeze({
  [DRIVER_STATUS.ACTIVE]: "Faol",
  [DRIVER_STATUS.ARCHIVED]: "Arxivlangan",
});

export const DRIVER_STATUS_BADGE_CLASS = Object.freeze({
  [DRIVER_STATUS.ACTIVE]: "bg-green-50 text-green-700",
  [DRIVER_STATUS.ARCHIVED]: "bg-gray-100 text-gray-600",
});

export const DRIVER_STATUS_FILTER_OPTIONS = [
  { value: "", label: "Barchasi" },
  { value: DRIVER_STATUS.ACTIVE, label: DRIVER_STATUS_LABELS[DRIVER_STATUS.ACTIVE] },
  { value: DRIVER_STATUS.ARCHIVED, label: DRIVER_STATUS_LABELS[DRIVER_STATUS.ARCHIVED] },
];

// "all" - barcha holatlar (query'da status yuborilmaydi)
export const DRIVER_STATUS_TAB_ALL = "all";

export const DRIVER_STATUS_TABS = [
  { value: DRIVER_STATUS_TAB_ALL, label: "Barchasi" },
  { value: DRIVER_STATUS.ACTIVE, label: "Aktiv" },
  { value: DRIVER_STATUS.ARCHIVED, label: "Arxivlangan" },
];

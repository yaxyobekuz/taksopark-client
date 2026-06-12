// Statik 2 tarif - server (workPeriod.model.js) bilan bir xil qiymatlar.
export const TARIFF = Object.freeze({
  DEPOSIT: "deposit",
  CASHBACK: "cashback",
});

export const TARIFF_LABELS = Object.freeze({
  [TARIFF.DEPOSIT]: "Depozitli",
  [TARIFF.CASHBACK]: "Keshbekli",
});

export const TARIFF_BADGE_CLASS = Object.freeze({
  [TARIFF.DEPOSIT]: "bg-blue-50 text-blue-700",
  [TARIFF.CASHBACK]: "bg-purple-50 text-purple-700",
});

export const TARIFF_OPTIONS = [
  { value: TARIFF.DEPOSIT, label: TARIFF_LABELS[TARIFF.DEPOSIT] },
  { value: TARIFF.CASHBACK, label: TARIFF_LABELS[TARIFF.CASHBACK] },
];

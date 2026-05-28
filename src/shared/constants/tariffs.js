export const TARIFFS = Object.freeze({
  DEPOSIT: "deposit",
  NO_DEPOSIT: "no_deposit",
});

export const ALL_TARIFFS = Object.values(TARIFFS);

export const TARIFF_LABELS = Object.freeze({
  [TARIFFS.DEPOSIT]: "Depozitli",
  [TARIFFS.NO_DEPOSIT]: "Depozitsiz",
});

export const TARIFF_TEXT_CLASS = Object.freeze({
  [TARIFFS.DEPOSIT]: "text-blue-600 font-medium",
  [TARIFFS.NO_DEPOSIT]: "text-amber-600 font-medium",
});

// Narx (kunlik to'lov, oylik cashback) endi mashinada saqlanadi. Bu yerda faqat
// tarifga xos metadata qoladi.
export const TARIFF_CONFIG = Object.freeze({
  [TARIFFS.DEPOSIT]: {
    hasTrial: false,
    hasCashback: false,
    trialDays: 0,
  },
  [TARIFFS.NO_DEPOSIT]: {
    hasTrial: true,
    hasCashback: true,
    trialDays: 7,
  },
});

// Depozit past ogohlantirish chegarasi (park darajasida).
export const DEPOSIT_WARN_THRESHOLD = 500_000;

export const TARIFF_OPTIONS = ALL_TARIFFS.map((value) => ({
  value,
  label: TARIFF_LABELS[value],
}));

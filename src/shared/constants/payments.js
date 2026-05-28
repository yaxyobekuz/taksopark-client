export const PAYMENT_SOURCES = Object.freeze({
  DRIVER_CASH: "driver_cash",
  DEPOSIT: "deposit",
  SYSTEM: "system",
});

export const PAYMENT_SOURCE_LABELS = Object.freeze({
  [PAYMENT_SOURCES.DRIVER_CASH]: "Haydovchi naqd",
  [PAYMENT_SOURCES.DEPOSIT]: "Depozitdan",
  [PAYMENT_SOURCES.SYSTEM]: "Tizimdan",
});

export const PAYMENT_STATUS = Object.freeze({
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
});

export const PAYMENT_STATUS_LABELS = Object.freeze({
  [PAYMENT_STATUS.PENDING]: "To'lanmagan",
  [PAYMENT_STATUS.PARTIAL]: "Qisman",
  [PAYMENT_STATUS.PAID]: "To'langan",
});

export const TRANSACTION_TYPES = Object.freeze({
  INCOME: "income",
  EXPENSE: "expense",
});

export const TRANSACTION_TYPE_LABELS = Object.freeze({
  [TRANSACTION_TYPES.INCOME]: "Kirim",
  [TRANSACTION_TYPES.EXPENSE]: "Chiqim",
});

export const TRANSACTION_SOURCES = Object.freeze({
  DAILY_PAYMENT: "daily_payment",
  FINE_PAYMENT_CASH: "fine_payment_cash",
  FINE_PAYMENT_DEPOSIT: "fine_payment_deposit",
  DAMAGE_PAYMENT_CASH: "damage_payment_cash",
  DAMAGE_PAYMENT_DEPOSIT: "damage_payment_deposit",
  FINE_SYSTEM: "fine_system",
  DAMAGE_SYSTEM: "damage_system",
  OYLIK_PAYOUT: "oylik_payout",
  MANUAL: "manual",
});

export const TRANSACTION_SOURCE_LABELS = Object.freeze({
  [TRANSACTION_SOURCES.DAILY_PAYMENT]: "Kunlik to'lov",
  [TRANSACTION_SOURCES.FINE_PAYMENT_CASH]: "Jarima - naqd",
  [TRANSACTION_SOURCES.FINE_PAYMENT_DEPOSIT]: "Jarima - depozit",
  [TRANSACTION_SOURCES.DAMAGE_PAYMENT_CASH]: "Zarar - naqd",
  [TRANSACTION_SOURCES.DAMAGE_PAYMENT_DEPOSIT]: "Zarar - depozit",
  [TRANSACTION_SOURCES.FINE_SYSTEM]: "Jarima - tizimdan",
  [TRANSACTION_SOURCES.DAMAGE_SYSTEM]: "Zarar - tizimdan",
  [TRANSACTION_SOURCES.OYLIK_PAYOUT]: "Oylik to'lovi",
  [TRANSACTION_SOURCES.MANUAL]: "Qo'lda",
});

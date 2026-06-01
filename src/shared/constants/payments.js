export const PAYMENT_SOURCES = Object.freeze({
  DRIVER_CASH: "driver_cash",
  DEPOSIT: "deposit",
});

export const PAYMENT_SOURCE_LABELS = Object.freeze({
  [PAYMENT_SOURCES.DRIVER_CASH]: "Haydovchi naqd",
  [PAYMENT_SOURCES.DEPOSIT]: "Depozitdan",
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

export const TRANSACTION_DIRECTIONS = Object.freeze({
  IN: "in",
  OUT: "out",
});

export const TRANSACTION_WALLETS = Object.freeze({
  DEPOSIT: "deposit",
  DEBT: "debt",
  REVENUE: "revenue",
  EXTERNAL: "external",
});

export const TRANSACTION_WALLET_LABELS = Object.freeze({
  [TRANSACTION_WALLETS.DEPOSIT]: "Depozit qoldig'i",
  [TRANSACTION_WALLETS.DEBT]: "Haydovchi qarzdorligi",
  [TRANSACTION_WALLETS.REVENUE]: "Taksopark daromadi",
  [TRANSACTION_WALLETS.EXTERNAL]: "Tashqi to'lovlar",
});

export const TRANSACTION_SOURCES = Object.freeze({
  DAILY_PAYMENT: "daily_payment",
  FINE_ISSUED: "fine_issued",
  DAMAGE_ISSUED: "damage_issued",
  FINE_DEPOSIT_DEDUCT: "fine_deposit_deduct",
  DAMAGE_DEPOSIT_DEDUCT: "damage_deposit_deduct",
  FINE_OYLIK_DEDUCT: "fine_oylik_deduct",
  DAMAGE_OYLIK_DEDUCT: "damage_oylik_deduct",
  FINE_DEBT_RECORD: "fine_debt_record",
  DAMAGE_DEBT_RECORD: "damage_debt_record",
  DEBT_REPAY_CASH: "debt_repay_cash",
  DEBT_REPAY_DEPOSIT: "debt_repay_deposit",
  DEBT_REPAY_OYLIK: "debt_repay_oylik",
  OYLIK_PAYOUT: "oylik_payout",
  DEPOSIT_TOPUP: "deposit_topup",
  DEPOSIT_WITHDRAW: "deposit_withdraw",
  DEPOSIT_REFUND: "deposit_refund",
  MANUAL: "manual",
});

export const TRANSACTION_SOURCE_LABELS = Object.freeze({
  [TRANSACTION_SOURCES.DAILY_PAYMENT]: "Kunlik to'lov",
  [TRANSACTION_SOURCES.FINE_ISSUED]: "Jarima yozildi",
  [TRANSACTION_SOURCES.DAMAGE_ISSUED]: "Zarar yozildi",
  [TRANSACTION_SOURCES.FINE_DEPOSIT_DEDUCT]: "Jarima - depozitdan ushlandi",
  [TRANSACTION_SOURCES.DAMAGE_DEPOSIT_DEDUCT]: "Zarar - depozitdan ushlandi",
  [TRANSACTION_SOURCES.FINE_OYLIK_DEDUCT]: "Jarima - oylikdan ushlandi",
  [TRANSACTION_SOURCES.DAMAGE_OYLIK_DEDUCT]: "Zarar - oylikdan ushlandi",
  [TRANSACTION_SOURCES.FINE_DEBT_RECORD]: "Jarima qarzga yozildi",
  [TRANSACTION_SOURCES.DAMAGE_DEBT_RECORD]: "Zarar qarzga yozildi",
  [TRANSACTION_SOURCES.DEBT_REPAY_CASH]: "Qarz naqd qaytarildi",
  [TRANSACTION_SOURCES.DEBT_REPAY_DEPOSIT]: "Qarz depozit orqali qaytarildi",
  [TRANSACTION_SOURCES.DEBT_REPAY_OYLIK]: "Qarz oylikdan qaytarildi",
  [TRANSACTION_SOURCES.OYLIK_PAYOUT]: "Oylik to'lovi",
  [TRANSACTION_SOURCES.DEPOSIT_TOPUP]: "Depozit to'ldirish",
  [TRANSACTION_SOURCES.DEPOSIT_WITHDRAW]: "Depozit yechib olish",
  [TRANSACTION_SOURCES.DEPOSIT_REFUND]: "Depozit qaytarish",
  [TRANSACTION_SOURCES.MANUAL]: "Qo'lda",
});

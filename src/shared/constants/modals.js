// Modal keys - also used as the Redux store name; never hardcode the string elsewhere
export const MODAL = Object.freeze({
  USER_CREATE: "user:create",
  USER_EDIT: "user:edit",
  USER_DELETE: "user:delete",
  ACTIVITY_LOG_DETAIL: "activityLog:detail",

  CAR_CREATE: "car:create",
  CAR_EDIT: "car:edit",
  CAR_DELETE: "car:delete",

  DRIVER_CREATE: "driver:create",
  DRIVER_EDIT: "driver:edit",
  DRIVER_DELETE: "driver:delete",
  DRIVER_END_TRIAL: "driver:endTrial",

  PAYMENT_CREATE: "payment:create",
  PAYMENT_EDIT: "payment:edit",
  PAYMENT_DELETE: "payment:delete",

  FINE_CREATE: "fine:create",
  FINE_DELETE: "fine:delete",
  FINE_PAY: "fine:pay",

  DAMAGE_CREATE: "damage:create",
  DAMAGE_DELETE: "damage:delete",
  DAMAGE_PAY: "damage:pay",

  OYLIK_CLOSE: "oylik:close",
  OYLIK_PAYOUT: "oylik:payout",
  OYLIK_PAYOUT_DELETE: "oylik:payoutDelete",

  TRANSACTION_CREATE: "transaction:create",
});

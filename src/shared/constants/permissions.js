// Permission keys - same strings live in the DB
export const PERMISSIONS = Object.freeze({
  USERS_READ: "users.read",
  ACTIVITY_LOGS_READ: "activity_logs.read",

  DRIVERS_READ: "drivers.read",
  DRIVERS_CREATE: "drivers.create",
  DRIVERS_UPDATE: "drivers.update",
  DRIVERS_DELETE: "drivers.delete",
  DRIVERS_BLOCK: "drivers.block",

  CARS_READ: "cars.read",
  CARS_CREATE: "cars.create",
  CARS_UPDATE: "cars.update",
  CARS_DELETE: "cars.delete",

  PAYMENTS_READ: "payments.read",
  PAYMENTS_CREATE: "payments.create",
  PAYMENTS_UPDATE: "payments.update",
  PAYMENTS_DELETE: "payments.delete",

  FINES_READ: "fines.read",
  FINES_CREATE: "fines.create",
  FINES_UPDATE: "fines.update",
  FINES_DELETE: "fines.delete",

  DAMAGES_READ: "damages.read",
  DAMAGES_CREATE: "damages.create",
  DAMAGES_UPDATE: "damages.update",
  DAMAGES_DELETE: "damages.delete",

  CYCLES_READ: "cycles.read",
  CYCLES_SETTLE: "cycles.settle",

  FINES_PAY: "fines.pay",
  DAMAGES_PAY: "damages.pay",

  TRANSACTIONS_READ: "transactions.read",
  TRANSACTIONS_CREATE: "transactions.create",
  TRANSACTIONS_DELETE: "transactions.delete",

  REPORTS_READ: "reports.read",
});

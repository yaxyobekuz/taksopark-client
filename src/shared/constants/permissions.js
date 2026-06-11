// Permission keys - same strings live in the DB
export const PERMISSIONS = Object.freeze({
  USERS_READ: "users.read",
  ACTIVITY_LOGS_READ: "activity_logs.read",

  ADMINS_READ: "admins.read",
  ADMINS_CREATE: "admins.create",
  ADMINS_UPDATE: "admins.update",
  ADMINS_DELETE: "admins.delete",

  DRIVERS_READ: "drivers.read",
  DRIVERS_CREATE: "drivers.create",
  DRIVERS_UPDATE: "drivers.update",
  DRIVERS_DELETE: "drivers.delete",
  DRIVERS_DOCUMENTS_MANAGE: "drivers.documents.manage",

  REST_DAYS_READ: "rest_days.read",
  REST_DAYS_MANAGE: "rest_days.manage",

  CARS_READ: "cars.read",
  CARS_CREATE: "cars.create",
  CARS_UPDATE: "cars.update",
  CARS_DELETE: "cars.delete",
  CARS_DOCUMENTS_MANAGE: "cars.documents.manage",

  FINES_READ: "fines.read",
  FINES_CREATE: "fines.create",
  FINES_UPDATE: "fines.update",
  FINES_DELETE: "fines.delete",

  DAMAGES_READ: "damages.read",
  DAMAGES_CREATE: "damages.create",
  DAMAGES_UPDATE: "damages.update",
  DAMAGES_DELETE: "damages.delete",
});

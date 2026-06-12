// Central registry of TanStack Query keys - extend here when adding a feature
export const qk = Object.freeze({
  auth: {
    me: () => ["auth", "me"],
  },
  users: {
    all: () => ["users"],
    list: (params) => ["users", "list", params],
    one: (id) => ["users", "detail", id],
  },
  admins: {
    all: () => ["admins"],
    list: (params) => ["admins", "list", params],
    one: (id) => ["admins", "detail", id],
    catalog: () => ["admins", "catalog"],
  },
  activityLogs: {
    all: () => ["activityLogs"],
    list: (params) => ["activityLogs", "list", params],
    one: (id) => ["activityLogs", "detail", id],
    stats: (params) => ["activityLogs", "stats", params],
  },
  cars: {
    all: () => ["cars"],
    list: (params) => ["cars", "list", params],
    one: (id) => ["cars", "detail", id],
    expiring: (params) => ["cars", "expiring", params],
  },
  carPrices: {
    all: () => ["carPrices"],
    list: (carId) => ["carPrices", "list", carId],
  },
  carDocumentTypes: {
    all: () => ["carDocumentTypes"],
    list: () => ["carDocumentTypes", "list"],
  },
  driverDocumentTypes: {
    all: () => ["driverDocumentTypes"],
    list: () => ["driverDocumentTypes", "list"],
  },
  drivers: {
    all: () => ["drivers"],
    list: (params) => ["drivers", "list", params],
    one: (id) => ["drivers", "detail", id],
  },
  workPeriods: {
    all: () => ["workPeriods"],
    list: (driverId) => ["workPeriods", "list", driverId],
  },
  payments: {
    all: () => ["payments"],
    month: (params) => ["payments", "month", params],
    planTx: (planId) => ["payments", "planTx", planId],
  },
  finance: {
    all: () => ["finance"],
    overview: (params) => ["finance", "overview", params],
    dailyPayments: (params) => ["finance", "dailyPayments", params],
    cashbacks: () => ["finance", "cashbacks"],
    cashbackDriver: (id) => ["finance", "cashbacks", id],
    deposits: () => ["finance", "deposits"],
    depositDriver: (id) => ["finance", "deposits", id],
  },
  restDays: {
    all: () => ["restDays"],
    list: (params) => ["restDays", "list", params],
    calendar: (params) => ["restDays", "calendar", params],
  },
  fines: {
    all: () => ["fines"],
    list: (params) => ["fines", "list", params],
    one: (id) => ["fines", "detail", id],
  },
  damages: {
    all: () => ["damages"],
    list: (params) => ["damages", "list", params],
    one: (id) => ["damages", "detail", id],
  },
});

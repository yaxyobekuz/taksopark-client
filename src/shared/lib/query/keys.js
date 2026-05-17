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
  },
  drivers: {
    all: () => ["drivers"],
    list: (params) => ["drivers", "list", params],
    one: (id) => ["drivers", "detail", id],
    balance: (id) => ["drivers", "balance", id],
    warnings: () => ["drivers", "warnings"],
  },
  payments: {
    all: () => ["payments"],
    list: (params) => ["payments", "list", params],
    todayTotal: (date) => ["payments", "todayTotal", date],
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
  cycles: {
    all: () => ["cycles"],
    list: (params) => ["cycles", "list", params],
    one: (id) => ["cycles", "detail", id],
    currentForDriver: (driverId) => ["cycles", "currentForDriver", driverId],
  },
  reports: {
    dailyPlanTotal: (date) => ["reports", "dailyPlanTotal", date],
    finance: (params) => ["reports", "finance", params],
    driverStatement: (driverId, range) => ["reports", "driverStatement", driverId, range],
    minYear: () => ["reports", "minYear"],
  },
  finePayments: {
    all: () => ["finePayments"],
    byFine: (fineId) => ["finePayments", "byFine", fineId],
  },
  damagePayments: {
    all: () => ["damagePayments"],
    byDamage: (damageId) => ["damagePayments", "byDamage", damageId],
  },
  transactions: {
    all: () => ["transactions"],
    list: (params) => ["transactions", "list", params],
    summary: (params) => ["transactions", "summary", params],
  },
});

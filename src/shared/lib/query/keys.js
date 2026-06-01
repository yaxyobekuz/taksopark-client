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
    balance: (id) => ["drivers", "balance", id],
    warnings: () => ["drivers", "warnings"],
  },
  restDays: {
    all: () => ["restDays"],
    list: (params) => ["restDays", "list", params],
    calendar: (params) => ["restDays", "calendar", params],
  },
  payments: {
    all: () => ["payments"],
    list: (params) => ["payments", "list", params],
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
  oyliklar: {
    all: () => ["oyliklar"],
    list: (params) => ["oyliklar", "list", params],
    one: (id) => ["oyliklar", "detail", id],
    currentForDriver: (driverId) => ["oyliklar", "currentForDriver", driverId],
    statement: (driverId) => ["oyliklar", "statement", driverId],
  },
  reports: {
    dailyPlanTotal: (date) => ["reports", "dailyPlanTotal", date],
    finance: (params) => ["reports", "finance", params],
    minYear: () => ["reports", "minYear"],
    monthlyIncomeExpense: () => ["reports", "monthlyIncomeExpense"],
    depositDriversMonthly: (params) => ["reports", "depositDriversMonthly", params],
    dailyIncomeExpense: (days) => ["reports", "dailyIncomeExpense", days],
    categoryMonthly: (params) => ["reports", "categoryMonthly", params],
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
  transactionCategories: {
    all: () => ["transactionCategories"],
    list: (type) => ["transactionCategories", "list", type ?? "all"],
  },
  financeReport: {
    all: () => ["financeReport"],
    overview: (params) => ["financeReport", "overview", params],
    walletRecent: (wallet, limit) => ["financeReport", "walletRecent", wallet, limit],
    integrity: () => ["financeReport", "integrity"],
  },
});

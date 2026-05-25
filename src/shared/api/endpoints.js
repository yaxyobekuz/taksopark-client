export const ENDPOINTS = Object.freeze({
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    registerUser: "/auth/register-user",
  },
  users: {
    base: "/users",
    byId: (id) => `/users/${id}`,
  },
  activityLogs: {
    base: "/activity-logs",
    byId: (id) => `/activity-logs/${id}`,
    stats: "/activity-logs/stats",
  },
  cars: {
    base: "/cars",
    byId: (id) => `/cars/${id}`,
    expiring: "/cars/expiring",
    documents: (id) => `/cars/${id}/documents`,
    documentById: (id, docId) => `/cars/${id}/documents/${docId}`,
  },
  carDocumentTypes: {
    base: "/car-document-types",
    byId: (id) => `/car-document-types/${id}`,
  },
  drivers: {
    base: "/drivers",
    byId: (id) => `/drivers/${id}`,
    balance: (id) => `/drivers/${id}/balance`,
    endTrial: (id) => `/drivers/${id}/end-trial`,
    warnings: "/drivers/warnings",
  },
  payments: {
    base: "/payments",
    byId: (id) => `/payments/${id}`,
    todayTotal: "/payments/today-total",
  },
  fines: {
    base: "/fines",
    byId: (id) => `/fines/${id}`,
  },
  damages: {
    base: "/damages",
    byId: (id) => `/damages/${id}`,
  },
  oyliklar: {
    base: "/oyliklar",
    byId: (id) => `/oyliklar/${id}`,
    currentForDriver: (driverId) => `/oyliklar/driver/${driverId}/current`,
    statementForDriver: (driverId) => `/oyliklar/driver/${driverId}/statement`,
    payouts: (id) => `/oyliklar/${id}/payouts`,
    payoutById: (id, payoutId) => `/oyliklar/${id}/payouts/${payoutId}`,
  },
  reports: {
    dailyPlanTotal: "/reports/daily-plan-total",
    finance: "/reports/finance",
    minYear: "/reports/min-year",
    monthlyIncomeExpense: "/reports/monthly-income-expense",
  },
  finePayments: {
    base: "/fine-payments",
    byId: (id) => `/fine-payments/${id}`,
    byFine: (fineId) => `/fine-payments/by-fine/${fineId}`,
  },
  damagePayments: {
    base: "/damage-payments",
    byId: (id) => `/damage-payments/${id}`,
    byDamage: (damageId) => `/damage-payments/by-damage/${damageId}`,
  },
  transactions: {
    base: "/transactions",
    byId: (id) => `/transactions/${id}`,
    summary: "/transactions/summary",
  },
});

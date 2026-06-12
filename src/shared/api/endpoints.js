export const ENDPOINTS = Object.freeze({
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    registerUser: "/auth/register-user",
    changePassword: "/auth/change-password",
  },
  users: {
    base: "/users",
    byId: (id) => `/users/${id}`,
  },
  admins: {
    base: "/admins",
    byId: (id) => `/admins/${id}`,
    permissions: (id) => `/admins/${id}/permissions`,
    password: (id) => `/admins/${id}/password`,
    catalog: "/admins/permission-catalog",
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
  carPrices: {
    base: "/car-prices",
    byId: (id) => `/car-prices/${id}`,
  },
  carDocumentTypes: {
    base: "/car-document-types",
    byId: (id) => `/car-document-types/${id}`,
  },
  drivers: {
    base: "/drivers",
    byId: (id) => `/drivers/${id}`,
    documents: (id) => `/drivers/${id}/documents`,
    documentById: (id, docId) => `/drivers/${id}/documents/${docId}`,
  },
  driverDocumentTypes: {
    base: "/driver-document-types",
    byId: (id) => `/driver-document-types/${id}`,
  },
  workPeriods: {
    base: "/work-periods",
    byId: (id) => `/work-periods/${id}`,
  },
  restDays: {
    base: "/rest-days",
    byId: (id) => `/rest-days/${id}`,
    calendar: "/rest-days/calendar",
  },
  fines: {
    base: "/fines",
    byId: (id) => `/fines/${id}`,
  },
  damages: {
    base: "/damages",
    byId: (id) => `/damages/${id}`,
  },
  payments: {
    plans: "/payments/plans",
    planById: (id) => `/payments/plans/${id}`,
    transactions: "/payments/transactions",
    reverse: (id) => `/payments/transactions/${id}/reverse`,
  },
  finance: {
    overview: "/finance/overview",
    dailyPayments: "/finance/daily-payments",
    cashbacks: "/finance/cashbacks",
    cashbackDriver: (id) => `/finance/cashbacks/${id}`,
    cashbackPayout: "/finance/cashbacks/payout",
    cashbackReverse: (id) => `/finance/cashbacks/transactions/${id}/reverse`,
    deposits: "/finance/deposits",
    depositDriver: (id) => `/finance/deposits/${id}`,
    depositMovement: "/finance/deposits/movement",
    depositReverse: (id) => `/finance/deposits/transactions/${id}/reverse`,
  },
});

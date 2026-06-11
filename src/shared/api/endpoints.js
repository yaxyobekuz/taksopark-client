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
});

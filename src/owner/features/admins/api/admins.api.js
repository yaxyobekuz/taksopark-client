import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const adminsAPI = {
  list: (params) => http.get(ENDPOINTS.admins.base, { params }),
  one: (id) => http.get(ENDPOINTS.admins.byId(id)),
  catalog: () => http.get(ENDPOINTS.admins.catalog),
  create: (body) => http.post(ENDPOINTS.admins.base, body),
  update: (id, body) => http.patch(ENDPOINTS.admins.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.admins.byId(id)),
  setPermissions: (id, permissions) =>
    http.patch(ENDPOINTS.admins.permissions(id), { permissions }),
  changePassword: (id, password) =>
    http.patch(ENDPOINTS.admins.password(id), { password }),
};

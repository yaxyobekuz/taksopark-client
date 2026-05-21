import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const driversAPI = {
  list: (params) => http.get(ENDPOINTS.drivers.base, { params }),
  getById: (id) => http.get(ENDPOINTS.drivers.byId(id)),
  getBalance: (id) => http.get(ENDPOINTS.drivers.balance(id)),
  warnings: () => http.get(ENDPOINTS.drivers.warnings),
  create: (body) => http.post(ENDPOINTS.drivers.base, body),
  update: (id, body) => http.patch(ENDPOINTS.drivers.byId(id), body),
  endTrial: (id, body) => http.post(ENDPOINTS.drivers.endTrial(id), body),
  remove: (id) => http.delete(ENDPOINTS.drivers.byId(id)),
};

import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const workPeriodsAPI = {
  list: (driverId) => http.get(ENDPOINTS.workPeriods.base, { params: { driverId } }),
  create: (body) => http.post(ENDPOINTS.workPeriods.base, body),
  update: (id, body) => http.patch(ENDPOINTS.workPeriods.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.workPeriods.byId(id)),
};

import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const restdaysAPI = {
  list: (params) => http.get(ENDPOINTS.restDays.base, { params }),
  calendar: (params) => http.get(ENDPOINTS.restDays.calendar, { params }),
  create: (body) => http.post(ENDPOINTS.restDays.base, body),
  remove: (id) => http.delete(ENDPOINTS.restDays.byId(id)),
};

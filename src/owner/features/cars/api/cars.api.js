import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const carsAPI = {
  list: (params) => http.get(ENDPOINTS.cars.base, { params }),
  getById: (id) => http.get(ENDPOINTS.cars.byId(id)),
  create: (body) => http.post(ENDPOINTS.cars.base, body),
  update: (id, body) => http.patch(ENDPOINTS.cars.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.cars.byId(id)),
};

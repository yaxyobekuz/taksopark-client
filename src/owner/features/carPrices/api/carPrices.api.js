import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const carPricesAPI = {
  list: (carId) => http.get(ENDPOINTS.carPrices.base, { params: { carId } }),
  create: (body) => http.post(ENDPOINTS.carPrices.base, body),
  update: (id, body) => http.patch(ENDPOINTS.carPrices.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.carPrices.byId(id)),
};

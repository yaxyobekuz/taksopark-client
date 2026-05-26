import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const paymentsAPI = {
  list: (params) => http.get(ENDPOINTS.payments.base, { params }),
  create: (body) => http.post(ENDPOINTS.payments.base, body),
  update: (id, body) => http.patch(ENDPOINTS.payments.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.payments.byId(id)),
};

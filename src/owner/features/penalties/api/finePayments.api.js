import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const finePaymentsAPI = {
  byFine: (fineId) => http.get(ENDPOINTS.finePayments.byFine(fineId)),
  create: (body) => http.post(ENDPOINTS.finePayments.base, body),
  remove: (id) => http.delete(ENDPOINTS.finePayments.byId(id)),
};

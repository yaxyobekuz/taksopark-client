import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const damagePaymentsAPI = {
  byDamage: (damageId) => http.get(ENDPOINTS.damagePayments.byDamage(damageId)),
  create: (body) => http.post(ENDPOINTS.damagePayments.base, body),
  remove: (id) => http.delete(ENDPOINTS.damagePayments.byId(id)),
};

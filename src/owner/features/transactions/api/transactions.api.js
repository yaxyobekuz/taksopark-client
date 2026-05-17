import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const transactionsAPI = {
  list: (params) => http.get(ENDPOINTS.transactions.base, { params }),
  summary: (params) => http.get(ENDPOINTS.transactions.summary, { params }),
  create: (body) => http.post(ENDPOINTS.transactions.base, body),
  remove: (id) => http.delete(ENDPOINTS.transactions.byId(id)),
};

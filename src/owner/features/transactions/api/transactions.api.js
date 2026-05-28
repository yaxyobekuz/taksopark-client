import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const transactionsAPI = {
  list: (params) => http.get(ENDPOINTS.transactions.base, { params }),
  summary: (params) => http.get(ENDPOINTS.transactions.summary, { params }),
  categoryReport: (params) => http.get(ENDPOINTS.reports.categoryMonthly, { params }),
  create: (body) => http.post(ENDPOINTS.transactions.base, body),
  update: (id, body) => http.patch(ENDPOINTS.transactions.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.transactions.byId(id)),
};

import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const transactionCategoriesAPI = {
  list: (params) => http.get(ENDPOINTS.transactionCategories.base, { params }),
  create: (body) => http.post(ENDPOINTS.transactionCategories.base, body),
  update: (id, body) => http.patch(ENDPOINTS.transactionCategories.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.transactionCategories.byId(id)),
};

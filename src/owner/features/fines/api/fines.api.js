import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const finesAPI = {
  list: (params) => http.get(ENDPOINTS.fines.base, { params }),
  getById: (id) => http.get(ENDPOINTS.fines.byId(id)),
  create: (formData) =>
    http.post(ENDPOINTS.fines.base, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, body) => http.patch(ENDPOINTS.fines.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.fines.byId(id)),
};

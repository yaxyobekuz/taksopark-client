import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const damagesAPI = {
  list: (params) => http.get(ENDPOINTS.damages.base, { params }),
  getById: (id) => http.get(ENDPOINTS.damages.byId(id)),
  create: (formData) =>
    http.post(ENDPOINTS.damages.base, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, body) => http.patch(ENDPOINTS.damages.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.damages.byId(id)),
};

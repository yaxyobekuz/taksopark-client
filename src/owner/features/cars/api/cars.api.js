import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const buildFormData = (body, photoFile) => {
  const fd = new FormData();
  Object.entries(body).forEach(([k, v]) => {
    if (v === undefined) return;
    fd.append(k, v === null ? "" : String(v));
  });
  if (photoFile instanceof File) fd.append("photo", photoFile);
  return fd;
};

export const carsAPI = {
  list: (params) => http.get(ENDPOINTS.cars.base, { params }),
  listExpiring: (params) => http.get(ENDPOINTS.cars.expiring, { params }),
  getById: (id) => http.get(ENDPOINTS.cars.byId(id)),
  create: ({ photoFile, ...body }) =>
    http.post(ENDPOINTS.cars.base, buildFormData(body, photoFile), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, { photoFile, ...body }) =>
    http.patch(ENDPOINTS.cars.byId(id), buildFormData(body, photoFile), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  remove: (id) => http.delete(ENDPOINTS.cars.byId(id)),
  finance: (params) => http.get(ENDPOINTS.reports.finance, { params }),
};

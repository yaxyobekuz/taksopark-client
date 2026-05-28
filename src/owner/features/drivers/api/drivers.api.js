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

export const driversAPI = {
  list: (params) => http.get(ENDPOINTS.drivers.base, { params }),
  getById: (id) => http.get(ENDPOINTS.drivers.byId(id)),
  getBalance: (id) => http.get(ENDPOINTS.drivers.balance(id)),
  warnings: () => http.get(ENDPOINTS.drivers.warnings),
  create: ({ photoFile, ...body }) =>
    http.post(ENDPOINTS.drivers.base, buildFormData(body, photoFile), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, { photoFile, ...body }) =>
    http.patch(ENDPOINTS.drivers.byId(id), buildFormData(body, photoFile), {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  endTrial: (id, body) => http.post(ENDPOINTS.drivers.endTrial(id), body),
  changeTariff: (id, body) => http.post(ENDPOINTS.drivers.changeTariff(id), body),
  adjustDeposit: (id, body) => http.post(ENDPOINTS.drivers.deposit(id), body),
  remove: (id) => http.delete(ENDPOINTS.drivers.byId(id)),
};

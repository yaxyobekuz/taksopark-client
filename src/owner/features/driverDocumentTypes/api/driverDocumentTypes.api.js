import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const driverDocumentTypesAPI = {
  list: () => http.get(ENDPOINTS.driverDocumentTypes.base),
  create: (body) => http.post(ENDPOINTS.driverDocumentTypes.base, body),
  update: (id, body) => http.patch(ENDPOINTS.driverDocumentTypes.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.driverDocumentTypes.byId(id)),
};

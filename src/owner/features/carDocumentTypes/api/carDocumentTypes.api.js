import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const carDocumentTypesAPI = {
  list: () => http.get(ENDPOINTS.carDocumentTypes.base),
  create: (body) => http.post(ENDPOINTS.carDocumentTypes.base, body),
  update: (id, body) => http.patch(ENDPOINTS.carDocumentTypes.byId(id), body),
  remove: (id) => http.delete(ENDPOINTS.carDocumentTypes.byId(id)),
};

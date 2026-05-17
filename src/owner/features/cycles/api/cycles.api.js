import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const cyclesAPI = {
  list: (params) => http.get(ENDPOINTS.cycles.base, { params }),
  getById: (id) => http.get(ENDPOINTS.cycles.byId(id)),
  currentForDriver: (driverId) => http.get(ENDPOINTS.cycles.currentForDriver(driverId)),
  settle: (id) => http.post(ENDPOINTS.cycles.settle(id)),
};

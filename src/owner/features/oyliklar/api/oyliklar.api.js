import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const oyliklarAPI = {
  list: (params) => http.get(ENDPOINTS.oyliklar.base, { params }),
  getById: (id) => http.get(ENDPOINTS.oyliklar.byId(id)),
  currentForDriver: (driverId) => http.get(ENDPOINTS.oyliklar.currentForDriver(driverId)),
  statementForDriver: (driverId) => http.get(ENDPOINTS.oyliklar.statementForDriver(driverId)),
  close: (id) => http.post(ENDPOINTS.oyliklar.close(id)),
  createPayout: (id, body) => http.post(ENDPOINTS.oyliklar.payouts(id), body),
  deletePayout: (id, payoutId) => http.delete(ENDPOINTS.oyliklar.payoutById(id, payoutId)),
};

import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const oyliklarAPI = {
  list: (params) => http.get(ENDPOINTS.oyliklar.base, { params }),
  getById: (id) => http.get(ENDPOINTS.oyliklar.byId(id)),
  currentForDriver: (driverId) => http.get(ENDPOINTS.oyliklar.currentForDriver(driverId)),
  statementForDriver: (driverId) => http.get(ENDPOINTS.oyliklar.statementForDriver(driverId)),
  createPayout: (id, body) => http.post(ENDPOINTS.oyliklar.payouts(id), body),
  updatePayout: (id, payoutId, body) => http.patch(ENDPOINTS.oyliklar.payoutById(id, payoutId), body),
  deletePayout: (id, payoutId) => http.delete(ENDPOINTS.oyliklar.payoutById(id, payoutId)),
};

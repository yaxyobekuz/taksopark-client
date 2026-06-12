import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const E = ENDPOINTS.finance;

export const financeAPI = {
  overview: (params) => http.get(E.overview, { params }),
  dailyPayments: (params) => http.get(E.dailyPayments, { params }),

  cashbacks: () => http.get(E.cashbacks),
  cashbackDriver: (driverId) => http.get(E.cashbackDriver(driverId)),
  cashbackPayout: (body) => http.post(E.cashbackPayout, body),
  cashbackReverse: (id) => http.post(E.cashbackReverse(id)),

  deposits: () => http.get(E.deposits),
  depositDriver: (driverId) => http.get(E.depositDriver(driverId)),
  depositMovement: (body) => http.post(E.depositMovement, body),
  depositReverse: (id) => http.post(E.depositReverse(id)),
};

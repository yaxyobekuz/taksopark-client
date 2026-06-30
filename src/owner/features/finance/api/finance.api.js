import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

const E = ENDPOINTS.finance;

export const financeAPI = {
  overview: (params) => http.get(E.overview, { params }),
  dailyPayments: (params) => http.get(E.dailyPayments, { params }),
  dailyPaymentsByDate: (params) => http.get(E.dailyPaymentsByDate, { params }),

  cashbacks: () => http.get(E.cashbacks),
  cashbackDriver: (driverId) => http.get(E.cashbackDriver(driverId)),
  cashbackPayout: (body) => http.post(E.cashbackPayout, body),
  cashbackDelete: (id) => http.delete(E.cashbackTxById(id)),

  deposits: () => http.get(E.deposits),
  depositDriver: (driverId) => http.get(E.depositDriver(driverId)),
  depositMovement: (body) => http.post(E.depositMovement, body),
  depositDelete: (id) => http.delete(E.depositTxById(id)),
};

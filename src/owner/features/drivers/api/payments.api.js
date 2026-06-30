import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const paymentsAPI = {
  // Oylik ko'rinish: kunlik planlar + to'langan/qarz + summary.
  month: ({ driverId, year, month }) =>
    http.get(ENDPOINTS.payments.plans, { params: { driverId, year, month } }),
  planTransactions: (dailyPlanId) =>
    http.get(ENDPOINTS.payments.transactions, { params: { dailyPlanId } }),
  createPayment: (body) => http.post(ENDPOINTS.payments.transactions, body),
  remove: (id) => http.delete(ENDPOINTS.payments.transactionById(id)),
  releaseAuto: (planId) => http.post(ENDPOINTS.payments.releaseAuto(planId)),
};

import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const reportsAPI = {
  dailyPlanTotal: (date) => http.get(ENDPOINTS.reports.dailyPlanTotal, { params: { date } }),
  finance: (params) => http.get(ENDPOINTS.reports.finance, { params }),
  minYear: () => http.get(ENDPOINTS.reports.minYear),
  monthlyIncomeExpense: () => http.get(ENDPOINTS.reports.monthlyIncomeExpense),
  depositDriversMonthly: (params) =>
    http.get(ENDPOINTS.reports.depositDriversMonthly, { params }),
  dailyIncomeExpense: (days) =>
    http.get(ENDPOINTS.reports.dailyIncomeExpense, { params: { days } }),
};

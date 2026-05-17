import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const reportsAPI = {
  dailyPlanTotal: (date) => http.get(ENDPOINTS.reports.dailyPlanTotal, { params: { date } }),
  finance: (params) => http.get(ENDPOINTS.reports.finance, { params }),
  driverStatement: (driverId, params) =>
    http.get(ENDPOINTS.reports.driverStatement(driverId), { params }),
  minYear: () => http.get(ENDPOINTS.reports.minYear),
};

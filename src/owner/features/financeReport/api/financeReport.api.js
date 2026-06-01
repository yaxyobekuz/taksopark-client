import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const financeReportAPI = {
  overview: (params) => http.get(ENDPOINTS.financeReport.overview, { params }),
  walletRecent: (wallet, params) =>
    http.get(ENDPOINTS.financeReport.walletRecent(wallet), { params }),
  integrity: () => http.get(ENDPOINTS.financeReport.integrity),
};

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { financeReportAPI } from "../api/financeReport.api";

export const useFinanceOverviewQuery = (params) =>
  useQuery({
    queryKey: qk.financeReport.overview(params),
    queryFn: () => financeReportAPI.overview(params).then((r) => r.data.data),
  });

export const useWalletRecentQuery = (wallet, limit = 5) =>
  useQuery({
    queryKey: qk.financeReport.walletRecent(wallet, limit),
    queryFn: () =>
      financeReportAPI.walletRecent(wallet, { limit }).then((r) => r.data.data),
    enabled: !!wallet,
  });

export const useFinanceIntegrityQuery = () =>
  useQuery({
    queryKey: qk.financeReport.integrity(),
    queryFn: () => financeReportAPI.integrity().then((r) => r.data.data),
  });

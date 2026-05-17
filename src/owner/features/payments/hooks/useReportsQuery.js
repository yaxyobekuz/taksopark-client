import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { reportsAPI } from "../api/reports.api";

export const useDailyPlanTotalQuery = (date) =>
  useQuery({
    queryKey: qk.reports.dailyPlanTotal(date),
    queryFn: () => reportsAPI.dailyPlanTotal(date).then((r) => r.data.data),
  });

export const useFinanceReportQuery = (params, enabled = true) =>
  useQuery({
    queryKey: qk.reports.finance(params),
    queryFn: () => reportsAPI.finance(params).then((r) => r.data.data),
    enabled: enabled && !!params.fromDate && !!params.toDate,
  });

export const useDriverStatementQuery = (driverId, range) =>
  useQuery({
    queryKey: qk.reports.driverStatement(driverId, range),
    queryFn: () => reportsAPI.driverStatement(driverId, range).then((r) => r.data.data),
    enabled: !!driverId,
  });

export const useReportsMinYearQuery = () =>
  useQuery({
    queryKey: qk.reports.minYear(),
    queryFn: () => reportsAPI.minYear().then((r) => r.data.data),
    staleTime: 1000 * 60 * 60,
  });

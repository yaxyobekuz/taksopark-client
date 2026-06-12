import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { financeAPI } from "../api/finance.api";

export const useOverviewQuery = (params) =>
  useQuery({
    queryKey: qk.finance.overview(params),
    queryFn: () => financeAPI.overview(params).then((r) => r.data.data),
  });

export const useDailyPaymentsQuery = (params) =>
  useQuery({
    queryKey: qk.finance.dailyPayments(params),
    queryFn: () => financeAPI.dailyPayments(params).then((r) => r.data.data),
  });

export const useCashbacksQuery = () =>
  useQuery({
    queryKey: qk.finance.cashbacks(),
    queryFn: () => financeAPI.cashbacks().then((r) => r.data.data),
  });

export const useCashbackDriverQuery = (driverId) =>
  useQuery({
    queryKey: qk.finance.cashbackDriver(driverId),
    queryFn: () => financeAPI.cashbackDriver(driverId).then((r) => r.data.data),
    enabled: !!driverId,
  });

export const useDepositsQuery = () =>
  useQuery({
    queryKey: qk.finance.deposits(),
    queryFn: () => financeAPI.deposits().then((r) => r.data.data),
  });

export const useDepositDriverQuery = (driverId) =>
  useQuery({
    queryKey: qk.finance.depositDriver(driverId),
    queryFn: () => financeAPI.depositDriver(driverId).then((r) => r.data.data),
    enabled: !!driverId,
  });

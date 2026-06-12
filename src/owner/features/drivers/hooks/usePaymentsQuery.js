import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { paymentsAPI } from "../api/payments.api";

export const usePaymentsMonthQuery = ({ driverId, year, month }) =>
  useQuery({
    queryKey: qk.payments.month({ driverId, year, month }),
    queryFn: () => paymentsAPI.month({ driverId, year, month }).then((r) => r.data.data),
    enabled: !!driverId,
  });

export const usePlanTransactionsQuery = (dailyPlanId) =>
  useQuery({
    queryKey: qk.payments.planTx(dailyPlanId),
    queryFn: () => paymentsAPI.planTransactions(dailyPlanId).then((r) => r.data.data),
    enabled: !!dailyPlanId,
  });

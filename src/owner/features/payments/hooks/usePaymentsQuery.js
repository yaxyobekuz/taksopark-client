import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { paymentsAPI } from "../api/payments.api";

export const usePaymentsQuery = (params = {}) =>
  useQuery({
    queryKey: qk.payments.list(params),
    queryFn: () => paymentsAPI.list(params).then((r) => r.data),
  });

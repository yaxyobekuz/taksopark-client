import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { carsAPI } from "../api/cars.api";

export const useCarFinanceQuery = (params, enabled = true) =>
  useQuery({
    queryKey: qk.reports.finance(params),
    queryFn: () => carsAPI.finance(params).then((r) => r.data.data),
    enabled: enabled && !!params.carId && !!params.fromDate && !!params.toDate,
  });

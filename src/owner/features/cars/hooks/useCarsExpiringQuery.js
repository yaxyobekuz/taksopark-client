import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { carsAPI } from "../api/cars.api";

export const useCarsExpiringQuery = (params = { limit: 5, days: 30 }) =>
  useQuery({
    queryKey: qk.cars.expiring(params),
    queryFn: () => carsAPI.listExpiring(params).then((r) => r.data.data),
    staleTime: 60_000,
  });

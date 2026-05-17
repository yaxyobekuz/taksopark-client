import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { carsAPI } from "../api/cars.api";

export const useCarsQuery = (params = {}) =>
  useQuery({
    queryKey: qk.cars.list(params),
    queryFn: () => carsAPI.list(params).then((r) => r.data),
  });

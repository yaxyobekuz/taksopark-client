import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { carsAPI } from "../api/cars.api";

export const useCarByIdQuery = (id) =>
  useQuery({
    queryKey: qk.cars.one(id),
    queryFn: () => carsAPI.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

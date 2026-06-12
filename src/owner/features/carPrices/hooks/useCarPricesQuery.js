import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { carPricesAPI } from "../api/carPrices.api";

export const useCarPricesQuery = (carId) =>
  useQuery({
    queryKey: qk.carPrices.list(carId),
    queryFn: () => carPricesAPI.list(carId).then((r) => r.data.data),
    enabled: !!carId,
  });

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { oyliklarAPI } from "../api/oyliklar.api";

export const useOyliklarQuery = (params = {}) =>
  useQuery({
    queryKey: qk.oyliklar.list(params),
    queryFn: () => oyliklarAPI.list(params).then((r) => r.data),
  });

export const useOylikQuery = (id) =>
  useQuery({
    queryKey: qk.oyliklar.one(id),
    queryFn: () => oyliklarAPI.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

export const useCurrentOylikQuery = (driverId) =>
  useQuery({
    queryKey: qk.oyliklar.currentForDriver(driverId),
    queryFn: () => oyliklarAPI.currentForDriver(driverId).then((r) => r.data.data),
    enabled: !!driverId,
  });

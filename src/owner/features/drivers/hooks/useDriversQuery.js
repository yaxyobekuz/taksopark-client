import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { driversAPI } from "../api/drivers.api";

export const useDriversQuery = (params = {}) =>
  useQuery({
    queryKey: qk.drivers.list(params),
    queryFn: () => driversAPI.list(params).then((r) => r.data),
  });

export const useDriverQuery = (id) =>
  useQuery({
    queryKey: qk.drivers.one(id),
    queryFn: () => driversAPI.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

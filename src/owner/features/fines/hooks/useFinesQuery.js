import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { finesAPI } from "../api/fines.api";

export const useFinesQuery = (params = {}) =>
  useQuery({
    queryKey: qk.fines.list(params),
    queryFn: () => finesAPI.list(params).then((r) => r.data),
  });

export const useFineQuery = (id) =>
  useQuery({
    queryKey: qk.fines.one(id),
    queryFn: () => finesAPI.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

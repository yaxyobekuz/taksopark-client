import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { cyclesAPI } from "../api/cycles.api";

export const useCyclesQuery = (params = {}) =>
  useQuery({
    queryKey: qk.cycles.list(params),
    queryFn: () => cyclesAPI.list(params).then((r) => r.data),
  });

export const useCycleQuery = (id) =>
  useQuery({
    queryKey: qk.cycles.one(id),
    queryFn: () => cyclesAPI.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });

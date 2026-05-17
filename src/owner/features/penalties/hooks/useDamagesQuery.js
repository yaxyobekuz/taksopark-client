import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { damagesAPI } from "../api/damages.api";

export const useDamagesQuery = (params = {}) =>
  useQuery({
    queryKey: qk.damages.list(params),
    queryFn: () => damagesAPI.list(params).then((r) => r.data),
  });

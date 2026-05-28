import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { adminsAPI } from "../api/admins.api";

export const usePermissionCatalogQuery = () =>
  useQuery({
    queryKey: qk.admins.catalog(),
    queryFn: () => adminsAPI.catalog().then((r) => r.data.data),
    staleTime: Infinity,
  });

import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { adminsAPI } from "../api/admins.api";

export const useAdminsQuery = (params) =>
  useQuery({
    queryKey: qk.admins.list(params),
    queryFn: () => adminsAPI.list(params).then((r) => r.data),
  });

export const useAdminQuery = (id) =>
  useQuery({
    queryKey: qk.admins.one(id),
    queryFn: () => adminsAPI.one(id).then((r) => r.data.data),
    enabled: !!id,
  });

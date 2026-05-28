import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { transactionCategoriesAPI } from "../api/transactionCategories.api";

export const useTransactionCategoriesQuery = (type) =>
  useQuery({
    queryKey: qk.transactionCategories.list(type),
    queryFn: () =>
      transactionCategoriesAPI.list(type ? { type } : undefined).then((r) => r.data.data),
  });

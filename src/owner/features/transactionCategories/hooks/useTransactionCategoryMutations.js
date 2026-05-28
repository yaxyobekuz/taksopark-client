import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { transactionCategoriesAPI } from "../api/transactionCategories.api";

const onError = (err) => {
  const msg = err?.response?.data?.message || "Xatolik yuz berdi";
  toast.error(msg);
};

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.transactionCategories.all() });
};

export const useTransactionCategoryCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => transactionCategoriesAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Kategoriya qo'shildi");
    },
    onError,
  });
};

export const useTransactionCategoryUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) =>
      transactionCategoriesAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Kategoriya yangilandi");
    },
    onError,
  });
};

export const useTransactionCategoryDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => transactionCategoriesAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Kategoriya o'chirildi");
    },
    onError,
  });
};

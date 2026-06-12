import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { financeAPI } from "../api/finance.api";

const onError = (err) => {
  toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
};

const invalidateFinance = (qc) => qc.invalidateQueries({ queryKey: qk.finance.all() });

export const useCashbackPayout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => financeAPI.cashbackPayout(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidateFinance(qc);
      toast.success("Keshbek to'lovi yozildi");
    },
    onError,
  });
};

export const useCashbackReverse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => financeAPI.cashbackReverse(id).then((r) => r.data.data),
    onSuccess: () => {
      invalidateFinance(qc);
      toast.success("Tranzaksiya bekor qilindi");
    },
    onError,
  });
};

export const useDepositMovement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => financeAPI.depositMovement(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidateFinance(qc);
      toast.success("Depozit harakati yozildi");
    },
    onError,
  });
};

export const useDepositReverse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => financeAPI.depositReverse(id).then((r) => r.data.data),
    onSuccess: () => {
      invalidateFinance(qc);
      toast.success("Tranzaksiya bekor qilindi");
    },
    onError,
  });
};

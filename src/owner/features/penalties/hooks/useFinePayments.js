import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { finePaymentsAPI } from "../api/finePayments.api";

const onError = (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi");

const invalidateAll = (qc) => {
  qc.invalidateQueries({ queryKey: qk.fines.all() });
  qc.invalidateQueries({ queryKey: qk.finePayments.all() });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  qc.invalidateQueries({ queryKey: qk.transactions.all() });
  qc.invalidateQueries({ queryKey: qk.cycles.all() });
  qc.invalidateQueries({ queryKey: ["reports"] });
};

export const useFinePaymentsByFine = (fineId, enabled = true) =>
  useQuery({
    queryKey: qk.finePayments.byFine(fineId),
    queryFn: () => finePaymentsAPI.byFine(fineId).then((r) => r.data.data),
    enabled: !!fineId && enabled,
  });

export const useFinePaymentCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => finePaymentsAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("To'lov saqlandi");
    },
    onError,
  });
};

export const useFinePaymentDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => finePaymentsAPI.remove(id),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("To'lov bekor qilindi");
    },
    onError,
  });
};

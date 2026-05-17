import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { damagePaymentsAPI } from "../api/damagePayments.api";

const onError = (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi");

const invalidateAll = (qc) => {
  qc.invalidateQueries({ queryKey: qk.damages.all() });
  qc.invalidateQueries({ queryKey: qk.damagePayments.all() });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  qc.invalidateQueries({ queryKey: qk.transactions.all() });
  qc.invalidateQueries({ queryKey: qk.cycles.all() });
  qc.invalidateQueries({ queryKey: ["reports"] });
};

export const useDamagePaymentsByDamage = (damageId, enabled = true) =>
  useQuery({
    queryKey: qk.damagePayments.byDamage(damageId),
    queryFn: () => damagePaymentsAPI.byDamage(damageId).then((r) => r.data.data),
    enabled: !!damageId && enabled,
  });

export const useDamagePaymentCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => damagePaymentsAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("To'lov saqlandi");
    },
    onError,
  });
};

export const useDamagePaymentDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => damagePaymentsAPI.remove(id),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("To'lov bekor qilindi");
    },
    onError,
  });
};

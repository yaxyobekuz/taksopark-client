import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { paymentsAPI } from "../api/payments.api";

const onError = (err) => {
  toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
};

// To'lov o'zgarsa: oylik ko'rinish + plan tranzaksiyalari + haydovchi(lar) +
// moliya umumiy sahifalari yangilanadi.
const invalidate = (qc, planId) => {
  qc.invalidateQueries({ queryKey: qk.payments.all() });
  if (planId) qc.invalidateQueries({ queryKey: qk.payments.planTx(planId) });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  qc.invalidateQueries({ queryKey: qk.finance.all() });
};

export const usePaymentCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => paymentsAPI.createPayment(body).then((r) => r.data.data),
    onSuccess: (plan) => {
      invalidate(qc, plan?._id);
      toast.success("To'lov qabul qilindi");
    },
    onError,
  });
};

export const usePaymentReverse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }) => paymentsAPI.reverse(id, { note }).then((r) => r.data.data),
    onSuccess: (plan) => {
      invalidate(qc, plan?._id);
      toast.success("Tranzaksiya bekor qilindi");
    },
    onError,
  });
};

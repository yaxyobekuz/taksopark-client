import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { paymentsAPI } from "../api/payments.api";

const onError = (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi");

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.payments.all() });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  qc.invalidateQueries({ queryKey: qk.cycles.all() });
  qc.invalidateQueries({ queryKey: ["reports"] });
};

export const usePaymentCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => paymentsAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("To'lov saqlandi");
    },
    onError,
  });
};

export const usePaymentUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => paymentsAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("To'lov yangilandi");
    },
    onError,
  });
};

export const usePaymentDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => paymentsAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("To'lov o'chirildi");
    },
    onError,
  });
};

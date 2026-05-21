import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { damagesAPI } from "../api/damages.api";

const onError = (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi");

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.damages.all() });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  qc.invalidateQueries({ queryKey: qk.oyliklar.all() });
  qc.invalidateQueries({ queryKey: ["reports"] });
};

export const useDamageCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => damagesAPI.create(formData).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Zarar saqlandi");
    },
    onError,
  });
};

export const useDamageDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => damagesAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Zarar o'chirildi");
    },
    onError,
  });
};

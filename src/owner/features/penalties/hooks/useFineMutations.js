import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { finesAPI } from "../api/fines.api";

const onError = (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi");

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.fines.all() });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  qc.invalidateQueries({ queryKey: qk.cycles.all() });
  qc.invalidateQueries({ queryKey: ["reports"] });
};

export const useFineCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData) => finesAPI.create(formData).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Jarima saqlandi");
    },
    onError,
  });
};

export const useFineDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => finesAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Jarima o'chirildi");
    },
    onError,
  });
};

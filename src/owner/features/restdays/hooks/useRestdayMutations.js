import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { restdaysAPI } from "../api/restdays.api";

const onError = (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi");

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.restDays.all() });
  qc.invalidateQueries({ queryKey: qk.payments.all() });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
};

export const useRestdayCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => restdaysAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Dam olish kuni belgilandi");
    },
    onError,
  });
};

export const useRestdayDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => restdaysAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Ish kuniga qaytarildi");
    },
    onError,
  });
};

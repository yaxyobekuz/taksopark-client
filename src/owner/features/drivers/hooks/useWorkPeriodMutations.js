import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { workPeriodsAPI } from "../api/workPeriods.api";

const onError = (err) => {
  toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
};

// Ish davri o'zgarsa: davrlar ro'yxati + haydovchi(lar) HOLATI yangilanadi.
const invalidate = (qc, driverId) => {
  qc.invalidateQueries({ queryKey: qk.workPeriods.list(driverId) });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
};

export const useWorkPeriodCreate = (driverId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => workPeriodsAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc, driverId);
      toast.success("Ish davri qo'shildi");
    },
    onError,
  });
};

export const useWorkPeriodUpdate = (driverId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => workPeriodsAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc, driverId);
      toast.success("Ish davri yangilandi");
    },
    onError,
  });
};

export const useWorkPeriodDelete = (driverId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => workPeriodsAPI.remove(id),
    onSuccess: () => {
      invalidate(qc, driverId);
      toast.success("Ish davri o'chirildi");
    },
    onError,
  });
};

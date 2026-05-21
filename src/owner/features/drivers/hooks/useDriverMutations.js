import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { driversAPI } from "../api/drivers.api";

const onError = (err) => {
  toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
};

const invalidateAll = (qc) => {
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  qc.invalidateQueries({ queryKey: qk.cars.all() });
  qc.invalidateQueries({ queryKey: qk.oyliklar.all() });
};

export const useDriverCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => driversAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("Haydovchi qo'shildi");
    },
    onError,
  });
};

export const useDriverUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => driversAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("Haydovchi yangilandi");
    },
    onError,
  });
};

export const useDriverRecompute = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => driversAPI.recompute(id).then((r) => r.data.data),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("Balans qayta hisoblandi");
    },
    onError,
  });
};

export const useDriverEndTrial = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, endDate }) =>
      driversAPI.endTrial(id, { endDate }).then((r) => r.data.data),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("Sinov muddati belgilandi");
    },
    onError,
  });
};

export const useDriverDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => driversAPI.remove(id),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("Haydovchi arxivlandi");
    },
    onError,
  });
};

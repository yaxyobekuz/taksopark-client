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

export const useDriverBlock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => driversAPI.block(id, reason).then((r) => r.data.data),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("Haydovchi bloklandi");
    },
    onError,
  });
};

export const useDriverUnblock = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => driversAPI.unblock(id).then((r) => r.data.data),
    onSuccess: () => {
      invalidateAll(qc);
      toast.success("Haydovchi blokdan chiqarildi");
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

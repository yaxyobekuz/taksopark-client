import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { carsAPI } from "../api/cars.api";

const onError = (err) => {
  const msg = err?.response?.data?.message || "Xatolik yuz berdi";
  toast.error(msg);
};

export const useCarCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => carsAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cars.all() });
      toast.success("Mashina qo'shildi");
    },
    onError,
  });
};

export const useCarUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => carsAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cars.all() });
      toast.success("Mashina yangilandi");
    },
    onError,
  });
};

export const useCarDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => carsAPI.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cars.all() });
      toast.success("Mashina o'chirildi");
    },
    onError,
  });
};

export const useCarRestore = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => carsAPI.update(id, { isActive: true }).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cars.all() });
      toast.success("Mashina tiklandi");
    },
    onError,
  });
};

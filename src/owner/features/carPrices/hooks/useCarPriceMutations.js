import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { carPricesAPI } from "../api/carPrices.api";

const onError = (err) => {
  toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
};

// Narx davri o'zgarsa: davrlar ro'yxati + mashina(lar) HOLATI yangilanadi.
const invalidate = (qc, carId) => {
  qc.invalidateQueries({ queryKey: qk.carPrices.list(carId) });
  qc.invalidateQueries({ queryKey: qk.cars.all() });
};

export const useCarPriceCreate = (carId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => carPricesAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc, carId);
      toast.success("Narx davri qo'shildi");
    },
    onError,
  });
};

export const useCarPriceUpdate = (carId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => carPricesAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc, carId);
      toast.success("Narx davri yangilandi");
    },
    onError,
  });
};

export const useCarPriceDelete = (carId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => carPricesAPI.remove(id),
    onSuccess: () => {
      invalidate(qc, carId);
      toast.success("Narx davri o'chirildi");
    },
    onError,
  });
};

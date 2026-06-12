import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { carAssignmentsAPI } from "../api/carAssignments.api";

const onError = (err) => {
  toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
};

// Biriktirish o'zgarsa: biriktirishlar + haydovchi(lar) + mashinalar (currentDriver) +
// kunlik planlar/moliya (mashina/narx snapshoti) yangilanadi.
const invalidate = (qc, driverId) => {
  qc.invalidateQueries({ queryKey: qk.carAssignments.list(driverId) });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  qc.invalidateQueries({ queryKey: qk.cars.all() });
  qc.invalidateQueries({ queryKey: qk.payments.all() });
  qc.invalidateQueries({ queryKey: qk.finance.all() });
};

export const useCarAssignmentCreate = (driverId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => carAssignmentsAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc, driverId);
      toast.success("Mashina biriktirildi");
    },
    onError,
  });
};

export const useCarAssignmentUpdate = (driverId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => carAssignmentsAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc, driverId);
      toast.success("Mashina biriktirish yangilandi");
    },
    onError,
  });
};

export const useCarAssignmentDelete = (driverId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => carAssignmentsAPI.remove(id),
    onSuccess: () => {
      invalidate(qc, driverId);
      toast.success("Mashina biriktirish o'chirildi");
    },
    onError,
  });
};

export const useCarChange = (driverId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => carAssignmentsAPI.changeCar(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc, driverId);
      toast.success("Mashina almashtirildi");
    },
    onError,
  });
};

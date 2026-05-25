import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { carDocumentTypesAPI } from "../api/carDocumentTypes.api";

const onError = (err) => {
  const msg = err?.response?.data?.message || "Xatolik yuz berdi";
  toast.error(msg);
};

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.carDocumentTypes.all() });
  qc.invalidateQueries({ queryKey: qk.cars.all() });
};

export const useCarDocumentTypeCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => carDocumentTypesAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Hujjat turi qo'shildi");
    },
    onError,
  });
};

export const useCarDocumentTypeUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) =>
      carDocumentTypesAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Hujjat turi yangilandi");
    },
    onError,
  });
};

export const useCarDocumentTypeDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => carDocumentTypesAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Hujjat turi o'chirildi");
    },
    onError,
  });
};

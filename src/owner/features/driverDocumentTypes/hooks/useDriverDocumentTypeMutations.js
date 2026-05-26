import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { driverDocumentTypesAPI } from "../api/driverDocumentTypes.api";

const onError = (err) => {
  const msg = err?.response?.data?.message || "Xatolik yuz berdi";
  toast.error(msg);
};

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.driverDocumentTypes.all() });
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
};

export const useDriverDocumentTypeCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => driverDocumentTypesAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Hujjat turi qo'shildi");
    },
    onError,
  });
};

export const useDriverDocumentTypeUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) =>
      driverDocumentTypesAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Hujjat turi yangilandi");
    },
    onError,
  });
};

export const useDriverDocumentTypeDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => driverDocumentTypesAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Hujjat turi o'chirildi");
    },
    onError,
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { qk } from "@/shared/lib/query/keys";

const onError = (err) => {
  const msg = err?.response?.data?.message || "Xatolik yuz berdi";
  toast.error(msg);
};

const buildFormData = ({ documentType, expiryDate, file, removeFile }) => {
  const fd = new FormData();
  if (documentType) fd.append("documentType", documentType);
  if (expiryDate !== undefined) fd.append("expiryDate", expiryDate ?? "");
  if (removeFile) fd.append("removeFile", "true");
  if (file instanceof File) fd.append("attachments", file);
  return fd;
};

const invalidate = (qc, carId) => {
  qc.invalidateQueries({ queryKey: qk.cars.all() });
  if (carId) qc.invalidateQueries({ queryKey: qk.cars.one(carId) });
};

export const useCarDocumentAdd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, documentType, expiryDate, file }) =>
      http
        .post(
          ENDPOINTS.cars.documents(carId),
          buildFormData({ documentType, expiryDate, file }),
          { headers: { "Content-Type": "multipart/form-data" } },
        )
        .then((r) => r.data.data),
    onSuccess: (_d, vars) => {
      invalidate(qc, vars.carId);
      toast.success("Hujjat qo'shildi");
    },
    onError,
  });
};

export const useCarDocumentUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, docId, expiryDate, file, removeFile }) =>
      http
        .patch(
          ENDPOINTS.cars.documentById(carId, docId),
          buildFormData({ expiryDate, file, removeFile }),
          { headers: { "Content-Type": "multipart/form-data" } },
        )
        .then((r) => r.data.data),
    onSuccess: (_d, vars) => {
      invalidate(qc, vars.carId);
      toast.success("Hujjat yangilandi");
    },
    onError,
  });
};

export const useCarDocumentRemove = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, docId }) =>
      http.delete(ENDPOINTS.cars.documentById(carId, docId)).then((r) => r.data.data),
    onSuccess: (_d, vars) => {
      invalidate(qc, vars.carId);
      toast.success("Hujjat o'chirildi");
    },
    onError,
  });
};

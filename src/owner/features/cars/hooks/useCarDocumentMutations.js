import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";
import { qk } from "@/shared/lib/query/keys";

const onError = (err) => {
  const msg = err?.response?.data?.message || "Xatolik yuz berdi";
  toast.error(msg);
};

const buildFormData = ({ documentType, expiryDate, files, removeFileUrls }) => {
  const fd = new FormData();
  if (documentType) fd.append("documentType", documentType);
  if (expiryDate !== undefined) fd.append("expiryDate", expiryDate ?? "");
  if (Array.isArray(files)) {
    for (const f of files) {
      if (f instanceof File) fd.append("attachments", f);
    }
  }
  if (Array.isArray(removeFileUrls)) {
    for (const url of removeFileUrls) fd.append("removeFileUrls", url);
  }
  return fd;
};

const invalidate = (qc, carId) => {
  qc.invalidateQueries({ queryKey: qk.cars.all() });
  if (carId) qc.invalidateQueries({ queryKey: qk.cars.one(carId) });
};

export const useCarDocumentAdd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ carId, documentType, expiryDate, files }) =>
      http
        .post(
          ENDPOINTS.cars.documents(carId),
          buildFormData({ documentType, expiryDate, files }),
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
    mutationFn: ({ carId, docId, expiryDate, files, removeFileUrls }) =>
      http
        .patch(
          ENDPOINTS.cars.documentById(carId, docId),
          buildFormData({ expiryDate, files, removeFileUrls }),
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

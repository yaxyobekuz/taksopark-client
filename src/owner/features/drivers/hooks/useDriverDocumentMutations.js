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

const invalidate = (qc, driverId) => {
  qc.invalidateQueries({ queryKey: qk.drivers.all() });
  if (driverId) qc.invalidateQueries({ queryKey: qk.drivers.one(driverId) });
};

export const useDriverDocumentAdd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ driverId, documentType, expiryDate, files }) =>
      http
        .post(
          ENDPOINTS.drivers.documents(driverId),
          buildFormData({ documentType, expiryDate, files }),
          { headers: { "Content-Type": "multipart/form-data" } },
        )
        .then((r) => r.data.data),
    onSuccess: (_d, vars) => {
      invalidate(qc, vars.driverId);
      toast.success("Hujjat qo'shildi");
    },
    onError,
  });
};

export const useDriverDocumentUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ driverId, docId, expiryDate, files, removeFileUrls }) =>
      http
        .patch(
          ENDPOINTS.drivers.documentById(driverId, docId),
          buildFormData({ expiryDate, files, removeFileUrls }),
          { headers: { "Content-Type": "multipart/form-data" } },
        )
        .then((r) => r.data.data),
    onSuccess: (_d, vars) => {
      invalidate(qc, vars.driverId);
      toast.success("Hujjat yangilandi");
    },
    onError,
  });
};

export const useDriverDocumentRemove = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ driverId, docId }) =>
      http
        .delete(ENDPOINTS.drivers.documentById(driverId, docId))
        .then((r) => r.data.data),
    onSuccess: (_d, vars) => {
      invalidate(qc, vars.driverId);
      toast.success("Hujjat o'chirildi");
    },
    onError,
  });
};

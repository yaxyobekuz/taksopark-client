import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { adminsAPI } from "../api/admins.api";

const onError = (err) => {
  toast.error(err?.response?.data?.message || "Xatolik yuz berdi");
};

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: qk.admins.all() });
};

export const useAdminCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => adminsAPI.create(body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Admin qo'shildi");
    },
    onError,
  });
};

export const useAdminUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }) => adminsAPI.update(id, body).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Admin yangilandi");
    },
    onError,
  });
};

export const useAdminDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => adminsAPI.remove(id),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Admin o'chirildi");
    },
    onError,
  });
};

export const useAdminSetPermissions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permissions }) =>
      adminsAPI.setPermissions(id, permissions).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Ruxsatlar saqlandi");
    },
    onError,
  });
};

export const useAdminChangePassword = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, password }) =>
      adminsAPI.changePassword(id, password).then((r) => r.data.data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Parol yangilandi");
    },
    onError,
  });
};

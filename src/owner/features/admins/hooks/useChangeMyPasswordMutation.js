import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/shared/api/http";
import { ENDPOINTS } from "@/shared/api/endpoints";

export const useChangeMyPasswordMutation = () =>
  useMutation({
    mutationFn: (body) => http.post(ENDPOINTS.auth.changePassword, body),
    onSuccess: () => toast.success("Parol yangilandi"),
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Xatolik yuz berdi"),
  });

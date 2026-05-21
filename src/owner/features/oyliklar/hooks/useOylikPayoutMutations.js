import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { oyliklarAPI } from "../api/oyliklar.api";

export const useOylikPayoutCreate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => oyliklarAPI.createPayout(id, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.oyliklar.all() });
      qc.invalidateQueries({ queryKey: qk.drivers.all() });
      qc.invalidateQueries({ queryKey: qk.transactions.all() });
      qc.invalidateQueries({ queryKey: ["reports"] });
      toast.success("To'lov saqlandi");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi"),
  });
};

export const useOylikPayoutUpdate = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payoutId, body }) =>
      oyliklarAPI.updatePayout(id, payoutId, body).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.oyliklar.all() });
      qc.invalidateQueries({ queryKey: qk.drivers.all() });
      qc.invalidateQueries({ queryKey: qk.transactions.all() });
      qc.invalidateQueries({ queryKey: ["reports"] });
      toast.success("To'lov yangilandi");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi"),
  });
};

export const useOylikPayoutDelete = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payoutId }) =>
      oyliklarAPI.deletePayout(id, payoutId).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.oyliklar.all() });
      qc.invalidateQueries({ queryKey: qk.drivers.all() });
      qc.invalidateQueries({ queryKey: qk.transactions.all() });
      qc.invalidateQueries({ queryKey: ["reports"] });
      toast.success("To'lov o'chirildi");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi"),
  });
};

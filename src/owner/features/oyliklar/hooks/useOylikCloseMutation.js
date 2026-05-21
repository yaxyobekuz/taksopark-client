import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { oyliklarAPI } from "../api/oyliklar.api";

export const useOylikCloseMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => oyliklarAPI.close(id).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.oyliklar.all() });
      qc.invalidateQueries({ queryKey: qk.drivers.all() });
      qc.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Oylik yopildi");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi"),
  });
};

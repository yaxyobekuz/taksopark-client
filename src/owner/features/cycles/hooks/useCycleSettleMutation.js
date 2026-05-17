import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/shared/lib/query/keys";
import { cyclesAPI } from "../api/cycles.api";

export const useCycleSettleMutation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => cyclesAPI.settle(id).then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.cycles.all() });
      qc.invalidateQueries({ queryKey: qk.drivers.all() });
      qc.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Tsikl yakunlandi");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Xatolik yuz berdi"),
  });
};

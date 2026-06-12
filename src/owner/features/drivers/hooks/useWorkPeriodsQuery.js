import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { workPeriodsAPI } from "../api/workPeriods.api";

export const useWorkPeriodsQuery = (driverId) =>
  useQuery({
    queryKey: qk.workPeriods.list(driverId),
    queryFn: () => workPeriodsAPI.list(driverId).then((r) => r.data.data),
    enabled: !!driverId,
  });

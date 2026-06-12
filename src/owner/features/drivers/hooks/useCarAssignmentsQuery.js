import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { carAssignmentsAPI } from "../api/carAssignments.api";

export const useCarAssignmentsQuery = (driverId) =>
  useQuery({
    queryKey: qk.carAssignments.list(driverId),
    queryFn: () => carAssignmentsAPI.list(driverId).then((r) => r.data.data),
    enabled: !!driverId,
  });

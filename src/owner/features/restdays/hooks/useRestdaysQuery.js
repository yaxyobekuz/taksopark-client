import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { restdaysAPI } from "../api/restdays.api";

export const useRestdaysQuery = (params = {}) =>
  useQuery({
    queryKey: qk.restDays.list(params),
    queryFn: () => restdaysAPI.list(params).then((r) => r.data),
  });

export const useRestdayCalendarQuery = ({ driverId, year, month }) =>
  useQuery({
    queryKey: qk.restDays.calendar({ driverId, year, month }),
    queryFn: () =>
      restdaysAPI.calendar({ driverId, year, month }).then((r) => r.data.data),
    enabled: !!driverId && !!year && !!month,
  });

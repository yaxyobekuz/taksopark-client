import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { oyliklarAPI } from "../api/oyliklar.api";

export const useOylikStatementQuery = (driverId) =>
  useQuery({
    queryKey: qk.oyliklar.statement(driverId),
    queryFn: () => oyliklarAPI.statementForDriver(driverId).then((r) => r.data.data),
    enabled: !!driverId,
  });

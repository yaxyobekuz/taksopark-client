import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { driverDocumentTypesAPI } from "../api/driverDocumentTypes.api";

export const useDriverDocumentTypesQuery = () =>
  useQuery({
    queryKey: qk.driverDocumentTypes.list(),
    queryFn: () => driverDocumentTypesAPI.list().then((r) => r.data.data),
  });

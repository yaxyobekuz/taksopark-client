import { useQuery } from "@tanstack/react-query";
import { qk } from "@/shared/lib/query/keys";
import { carDocumentTypesAPI } from "../api/carDocumentTypes.api";

export const useCarDocumentTypesQuery = () =>
  useQuery({
    queryKey: qk.carDocumentTypes.list(),
    queryFn: () => carDocumentTypesAPI.list().then((r) => r.data.data),
  });

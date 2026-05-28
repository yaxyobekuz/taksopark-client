import {
  FileText,
  Pencil,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

import Badge from "@/shared/components/ui/badge/Badge";
import Button from "@/shared/components/ui/button/Button";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";

import { getExpiryStatus, getDaysLeft } from "../utils/expiryStatus";

const ExpiryBadge = ({ date }) => {
  const status = getExpiryStatus(date);
  if (status === "unset") return <Badge variant="outline">Belgilanmagan</Badge>;
  if (status === "expired") {
    const days = -getDaysLeft(date);
    return <Badge >Muddati o'tgan ({days} kun)</Badge>;
  }
  if (status === "expiring_soon") {
    return (
      <Badge className="bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-100">
        Tez orada ({getDaysLeft(date)} kun qoldi)
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-100 text-green-800 border border-green-300 hover:bg-green-100">
      Joriy
    </Badge>
  );
};

const FileThumb = ({ file }) => {
  const url = buildFileUrl(file.url);
  const isImage = (file.mime || "").startsWith("image/");
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="block size-16 overflow-hidden rounded-[2px] border bg-muted/40"
      title={file.filename || "Faylni ochish"}
    >
      {isImage ? (
        <img src={url} alt={file.filename || ""} className="size-full object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center text-muted-foreground">
          <FileText size={20} />
        </span>
      )}
    </a>
  );
};

const CarDocumentsSection = ({ carId, documents = [] }) => {
  const { openModal } = useModal();

  return (
    <div className="space-y-3">
      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground py-3">
          Hujjat qo'shilmagan
        </p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc._id}
            className="flex flex-wrap items-start justify-between gap-3 py-3 border-b first:pt-0 last:pb-0"
          >
            <div className="min-w-0 space-y-2 flex-1">
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {doc.documentType?.name || "—"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {doc.expiryDate
                    ? formatDateUZ(doc.expiryDate) + " gacha"
                    : "Muddati belgilanmagan"}
                </p>
              </div>

              {doc.files?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {doc.files.map((f) => (
                    <FileThumb key={f.url} file={f} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <ExpiryBadge date={doc.expiryDate} />
              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  openModal(MODAL.CAR_DOC_EDIT, { carId, document: doc })
                }
              >
                <Pencil size={14} />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() =>
                  openModal(MODAL.CAR_DOC_DELETE, { carId, document: doc })
                }
              >
                <Trash2 size={14} className="text-red-600" />
              </Button>
            </div>
          </div>
        ))
      )}

      <div className="flex items-center justify-center w-full">
        <Button
          size="sm"
          onClick={() => openModal(MODAL.CAR_DOC_CREATE, { carId })}
        >
          <Plus /> Yangi hujjat qo'shish
        </Button>
      </div>
    </div>
  );
};

export default CarDocumentsSection;

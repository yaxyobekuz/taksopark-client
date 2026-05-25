import { Plus, Pencil, Trash2, FileType } from "lucide-react";

import Button from "@/shared/components/ui/button/Button";
import Card from "@/shared/components/ui/card/Card";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";

import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";

import { useCarDocumentTypesQuery } from "../hooks/useCarDocumentTypesQuery";
import CarDocumentTypeCreateModal from "../components/modals/CarDocumentTypeCreateModal";
import CarDocumentTypeEditModal from "../components/modals/CarDocumentTypeEditModal";
import CarDocumentTypeDeleteModal from "../components/modals/CarDocumentTypeDeleteModal";

const CarDocumentTypesPage = () => {
  const { data: items = [], isLoading } = useCarDocumentTypesQuery();
  const { openModal } = useModal();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Mashina hujjat turlari</h1>

        <Button size="sm" onClick={() => openModal(MODAL.CAR_DOC_TYPE_CREATE)}>
          <Plus size={14} className="mr-1.5" /> Yangi tur
        </Button>
      </div>

      {isLoading ? (
        <SkeletonCard count={2} />
      ) : items.length === 0 ? (
        <EmptyState
          title="Hujjat turlari yo'q"
          description="Birinchi hujjat turini qo'shing"
        />
      ) : (
        <Card>
          <div className="divide-y">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileType
                    size={18}
                    className="text-muted-foreground shrink-0"
                  />
                  <p className="text-sm font-medium truncate">{item.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      openModal(MODAL.CAR_DOC_TYPE_EDIT, { docType: item })
                    }
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      openModal(MODAL.CAR_DOC_TYPE_DELETE, { docType: item })
                    }
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ModalWrapper name={MODAL.CAR_DOC_TYPE_CREATE} title="Yangi hujjat turi">
        <CarDocumentTypeCreateModal />
      </ModalWrapper>
      <ModalWrapper
        name={MODAL.CAR_DOC_TYPE_EDIT}
        title="Hujjat turini tahrirlash"
      >
        <CarDocumentTypeEditModal />
      </ModalWrapper>
      <ModalWrapper
        name={MODAL.CAR_DOC_TYPE_DELETE}
        title="O'chirishni tasdiqlash"
      >
        <CarDocumentTypeDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default CarDocumentTypesPage;

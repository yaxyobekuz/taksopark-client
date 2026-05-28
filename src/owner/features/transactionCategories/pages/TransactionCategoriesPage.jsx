import { Plus, Pencil, Trash2, Tag } from "lucide-react";

import Button from "@/shared/components/ui/button/Button";
import Card from "@/shared/components/ui/card/Card";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";

import useModal from "@/shared/hooks/useModal";
import { MODAL } from "@/shared/constants/modals";
import { TRANSACTION_TYPES, TRANSACTION_TYPE_LABELS } from "@/shared/constants/payments";

import { useTransactionCategoriesQuery } from "../hooks/useTransactionCategoriesQuery";
import TransactionCategoryCreateModal from "../components/modals/TransactionCategoryCreateModal";
import TransactionCategoryEditModal from "../components/modals/TransactionCategoryEditModal";
import TransactionCategoryDeleteModal from "../components/modals/TransactionCategoryDeleteModal";

const CategorySection = ({ type, title }) => {
  const { data: items = [], isLoading } = useTransactionCategoriesQuery(type);
  const { openModal } = useModal();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button size="sm" onClick={() => openModal(MODAL.TX_CATEGORY_CREATE, { type })}>
          <Plus size={14} className="mr-1.5" /> Qo'shish
        </Button>
      </div>

      {isLoading ? (
        <SkeletonCard count={2} />
      ) : items.length === 0 ? (
        <EmptyState title="Kategoriya yo'q" description="Birinchi kategoriyani qo'shing" />
      ) : (
        <Card>
          <div className="divide-y">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Tag size={18} className="text-muted-foreground shrink-0" />
                  <p className="text-sm font-medium truncate">{item.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openModal(MODAL.TX_CATEGORY_EDIT, { category: item })}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openModal(MODAL.TX_CATEGORY_DELETE, { category: item })}
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

const TransactionCategoriesPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tranzaksiya kategoriyalari</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySection
          type={TRANSACTION_TYPES.INCOME}
          title={`${TRANSACTION_TYPE_LABELS.income} kategoriyalari`}
        />
        <CategorySection
          type={TRANSACTION_TYPES.EXPENSE}
          title={`${TRANSACTION_TYPE_LABELS.expense} kategoriyalari`}
        />
      </div>

      <ModalWrapper name={MODAL.TX_CATEGORY_CREATE} title="Yangi kategoriya">
        <TransactionCategoryCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.TX_CATEGORY_EDIT} title="Kategoriyani tahrirlash">
        <TransactionCategoryEditModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.TX_CATEGORY_DELETE} title="O'chirishni tasdiqlash">
        <TransactionCategoryDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default TransactionCategoriesPage;

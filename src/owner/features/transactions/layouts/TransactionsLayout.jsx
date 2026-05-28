import { Outlet } from "react-router-dom";
import { Plus } from "lucide-react";

import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import TabsLinks from "@/shared/components/ui/tabs/TabsLinks";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";

import TransactionCreateModal from "../components/modals/TransactionCreateModal";
import TransactionEditModal from "../components/modals/TransactionEditModal";

const TransactionsLayout = () => {
  const { openModal } = useModal();
  const { has } = usePermissions();

  const tabs = [
    { to: "/owner/transactions", label: "Asosiy", exact: true },
    { to: "/owner/transactions/report", label: "Kategoriya hisoboti" },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Kirim-Chiqim"
        actions={
          has(PERMISSIONS.TRANSACTIONS_CREATE) && (
            <Button onClick={() => openModal(MODAL.TRANSACTION_CREATE)}>
              <Plus size={16} className="mr-1.5" /> Yangi tranzaksiya
            </Button>
          )
        }
      />

      <div className="sticky top-12 md:top-0 z-10 -mx-4 px-4 py-2 bg-background border-b">
        <TabsLinks items={tabs} listClassName="overflow-x-auto scrollbar-hide" />
      </div>

      <Outlet />

      <ModalWrapper
        name={MODAL.TRANSACTION_CREATE}
        title="Yangi tranzaksiya"
        className="max-w-lg"
      >
        <TransactionCreateModal />
      </ModalWrapper>
      <ModalWrapper
        name={MODAL.TRANSACTION_EDIT}
        title="Tranzaksiyani tahrirlash"
        className="max-w-lg"
      >
        <TransactionEditModal />
      </ModalWrapper>
    </div>
  );
};

export default TransactionsLayout;

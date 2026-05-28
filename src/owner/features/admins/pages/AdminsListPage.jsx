import { Plus, ShieldCheck } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import InputField from "@/shared/components/ui/input/InputField";
import SelectField from "@/shared/components/ui/select/SelectField";
import Pagination from "@/shared/components/ui/pagination/Pagination";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import PageHeader from "@/shared/components/ui/layout/PageHeader";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";

import { useAdminsQuery } from "../hooks/useAdminsQuery";
import AdminsTable from "../components/AdminsTable";
import AdminCreateModal from "../components/modals/AdminCreateModal";
import AdminEditModal from "../components/modals/AdminEditModal";
import AdminPasswordModal from "../components/modals/AdminPasswordModal";
import AdminDeleteModal from "../components/modals/AdminDeleteModal";

const STATUS_OPTIONS = [
  { value: "", label: "Barcha holatlar" },
  { value: "true", label: "Faol" },
  { value: "false", label: "Faol emas" },
];

const AdminsListPage = () => {
  const { page, search, status, setField, setFields } = useObjectState({
    page: 1,
    search: "",
    status: "",
  });
  const { openModal } = useModal();
  const { has } = usePermissions();

  const { data, isLoading } = useAdminsQuery({
    page,
    limit: 20,
    search: search || undefined,
    isActive: status || undefined,
  });
  const items = data?.data || [];
  const meta = data?.meta || { pages: 1, total: 0 };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Adminlar"
        description={meta.total ? `Jami ${meta.total} ta` : ""}
        actions={
          has(PERMISSIONS.ADMINS_CREATE) && (
            <Button onClick={() => openModal(MODAL.ADMIN_CREATE)}>
              <Plus size={16} className="mr-1.5" /> Yangi admin
            </Button>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <InputField
          type="search"
          placeholder="Qidirish (ism, login)..."
          value={search}
          onChange={(e) => setFields({ search: e.target.value, page: 1 })}
        />
        <SelectField
          value={status}
          onChange={(v) => setFields({ status: v, page: 1 })}
          options={STATUS_OPTIONS}
        />
      </div>

      {isLoading ? (
        <SkeletonCard count={3} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Admin topilmadi"
          description="Yangi admin qo'shish uchun yuqoridagi tugmadan foydalaning"
          action={
            has(PERMISSIONS.ADMINS_CREATE) ? (
              <Button onClick={() => openModal(MODAL.ADMIN_CREATE)}>
                <Plus size={16} className="mr-1.5" /> Yangi admin
              </Button>
            ) : null
          }
        />
      ) : (
        <AdminsTable items={items} />
      )}

      <Pagination
        currentPage={page}
        totalPages={meta.pages || 1}
        hasNextPage={page < (meta.pages || 1)}
        hasPrevPage={page > 1}
        onPageChange={(p) => setField("page", p)}
      />

      <ModalWrapper name={MODAL.ADMIN_CREATE} title="Yangi admin qo'shish" className="max-w-2xl">
        <AdminCreateModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.ADMIN_EDIT} title="Adminni tahrirlash" className="max-w-xl">
        <AdminEditModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.ADMIN_PASSWORD} title="Parolni o'zgartirish" className="max-w-md">
        <AdminPasswordModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.ADMIN_DELETE} title="Adminni o'chirish" className="max-w-md">
        <AdminDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default AdminsListPage;

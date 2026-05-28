import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, KeyRound, Trash2 } from "lucide-react";

import useObjectState from "@/shared/hooks/useObjectState";
import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import DetailSection from "@/shared/components/ui/layout/DetailSection";
import KeyValueList from "@/shared/components/ui/data/KeyValueList";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";

import { MODAL } from "@/shared/constants/modals";
import { PERMISSIONS } from "@/shared/constants/permissions";

import { useAdminQuery } from "../hooks/useAdminsQuery";
import { useAdminSetPermissions } from "../hooks/useAdminMutations";
import PermissionGrid from "../components/PermissionGrid";
import AdminEditModal from "../components/modals/AdminEditModal";
import AdminPasswordModal from "../components/modals/AdminPasswordModal";
import AdminDeleteModal from "../components/modals/AdminDeleteModal";

const AdminDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { has } = usePermissions();
  const { data: admin, isLoading } = useAdminQuery(id);
  const setPermissions = useAdminSetPermissions();

  const { permissions, setField, setFields } = useObjectState({ permissions: [] });

  useEffect(() => {
    if (admin) setFields({ permissions: admin.permissions || [] });
  }, [admin, setFields]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard count={2} />
      </div>
    );
  }
  if (!admin) {
    return (
      <div className="space-y-4">
        <Link
          to="/owner/admins"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} className="mr-1" /> Adminlar
        </Link>
        <EmptyState title="Admin topilmadi" />
      </div>
    );
  }

  const canUpdate = has(PERMISSIONS.ADMINS_UPDATE);
  const canDelete = has(PERMISSIONS.ADMINS_DELETE);

  const items = [
    { label: "Ism", value: admin.firstName },
    { label: "Familiya", value: admin.lastName || "-" },
    { label: "Login", value: admin.username },
    {
      label: "Telefon",
      value: admin.phone || "-",
      href: admin.phone ? `tel:${admin.phone}` : null,
    },
    { label: "Parol", value: admin.password || "-", copyable: !!admin.password },
    {
      label: "Holat",
      value: admin.isActive ? "Faol" : "Faol emas",
    },
  ];

  const handleSavePermissions = () => {
    setPermissions.mutate({ id: admin._id, permissions });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/owner/admins"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} className="mr-1" /> Adminlar
        </Link>
        <div className="flex flex-wrap gap-2">
          {canUpdate && (
            <>
              <Button size="sm" variant="outline" onClick={() => openModal(MODAL.ADMIN_EDIT, { admin })}>
                <Pencil size={14} className="mr-1.5" /> Tahrirlash
              </Button>
              <Button size="sm" variant="outline" onClick={() => openModal(MODAL.ADMIN_PASSWORD, { admin })}>
                <KeyRound size={14} className="mr-1.5" /> Parol
              </Button>
            </>
          )}
          {canDelete && (
            <Button
              size="sm"
              variant="outline"
              className="text-red-600"
              onClick={() => openModal(MODAL.ADMIN_DELETE, { admin })}
            >
              <Trash2 size={14} className="mr-1.5" /> O'chirish
            </Button>
          )}
        </div>
      </div>

      <h1 className="text-lg sm:text-xl font-semibold">
        {`${admin.firstName} ${admin.lastName || ""}`.trim()}
      </h1>

      <DetailSection title="Asosiy ma'lumot" defaultOpen>
        <KeyValueList columns={2} items={items} />
      </DetailSection>

      <DetailSection title="Ruxsatlar" defaultOpen>
        <div className="space-y-4">
          <PermissionGrid
            value={permissions}
            onChange={(v) => setField("permissions", v)}
            disabled={!canUpdate || setPermissions.isPending}
          />
          {canUpdate && (
            <div className="flex justify-end">
              <Button onClick={handleSavePermissions} disabled={setPermissions.isPending}>
                {setPermissions.isPending ? "Saqlanmoqda..." : "Ruxsatlarni saqlash"}
              </Button>
            </div>
          )}
        </div>
      </DetailSection>

      <ModalWrapper name={MODAL.ADMIN_EDIT} title="Adminni tahrirlash" className="max-w-xl">
        <AdminEditModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.ADMIN_PASSWORD} title="Parolni o'zgartirish" className="max-w-md">
        <AdminPasswordModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.ADMIN_DELETE} title="Adminni o'chirish" className="max-w-md">
        <AdminDeleteModal onDeleted={() => navigate("/owner/admins")} />
      </ModalWrapper>
    </div>
  );
};

export default AdminDetailPage;

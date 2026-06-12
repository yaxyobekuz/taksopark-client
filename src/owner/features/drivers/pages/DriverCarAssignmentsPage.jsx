import { useOutletContext } from "react-router-dom";
import { Plus, Pencil, Trash2, Car as CarIcon } from "lucide-react";

import useModal from "@/shared/hooks/useModal";
import usePermissions from "@/shared/hooks/usePermissions";

import Button from "@/shared/components/ui/button/Button";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import SkeletonCard from "@/shared/components/ui/skeleton/SkeletonCard";

import { PERMISSIONS } from "@/shared/constants/permissions";
import { MODAL } from "@/shared/constants/modals";
import { formatDateUZ } from "@/shared/utils/date.utils";

import { useCarAssignmentsQuery } from "../hooks/useCarAssignmentsQuery";
import { periodState } from "../utils/workPeriod.utils";
import CarAssignmentFormModal from "../components/modals/CarAssignmentFormModal";
import CarAssignmentDeleteModal from "../components/modals/CarAssignmentDeleteModal";

const STATE_BADGE = {
  active: { label: "Joriy", className: "bg-green-50 text-green-700" },
  past: { label: "Yakunlangan", className: "bg-gray-100 text-gray-600" },
  future: { label: "Rejalashtirilgan", className: "bg-amber-50 text-amber-700" },
};

const DriverCarAssignmentsPage = () => {
  const { driver } = useOutletContext();
  const driverId = driver._id;
  const { openModal } = useModal();
  const { has } = usePermissions();
  const canManage = has(PERMISSIONS.DRIVERS_UPDATE);

  const { data: assignments = [], isLoading } = useCarAssignmentsQuery(driverId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Mashina biriktirish davrlari</h2>
        {canManage && (
          <Button size="sm" onClick={() => openModal(MODAL.CAR_ASSIGNMENT_FORM, { driverId })}>
            <Plus size={16} className="mr-1.5" /> Yangi biriktirish
          </Button>
        )}
      </div>

      {isLoading ? (
        <SkeletonCard count={3} />
      ) : assignments.length === 0 ? (
        <EmptyState
          icon={CarIcon}
          title="Mashina biriktirilmagan"
          description="Haydovchiga qaysi davrda qaysi mashina biriktirilganini shu yerda yuriting"
          action={
            canManage ? (
              <Button onClick={() => openModal(MODAL.CAR_ASSIGNMENT_FORM, { driverId })}>
                <Plus size={16} className="mr-1.5" /> Yangi biriktirish
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="space-y-2">
          {assignments.map((a) => {
            const state = STATE_BADGE[periodState(a)] || STATE_BADGE.past;
            return (
              <div key={a._id} className="flex items-center justify-between gap-3 rounded-lg border bg-white p-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {a.car?.plateNumber ? (
                      <PlateNumber value={a.car.plateNumber} size="sm" />
                    ) : (
                      <span className="text-sm font-medium">{a.car?.model || "Mashina"}</span>
                    )}
                    {a.car?.model && <span className="text-xs text-muted-foreground">{a.car.model}</span>}
                    <span className={`text-[11px] px-1.5 py-0.5 rounded ${state.className}`}>{state.label}</span>
                  </div>
                  <p className="text-sm">
                    {formatDateUZ(a.startDate)} - {a.endDate ? formatDateUZ(a.endDate) : "hozirgacha"}
                  </p>
                  {a.note && <p className="text-xs text-muted-foreground">{a.note}</p>}
                </div>

                {canManage && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.CAR_ASSIGNMENT_FORM, { driverId, assignment: a })}
                      className="p-1.5 text-muted-foreground hover:text-foreground"
                      title="Tahrirlash"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openModal(MODAL.CAR_ASSIGNMENT_DELETE, { driverId, assignment: a })}
                      className="p-1.5 text-muted-foreground hover:text-red-600"
                      title="O'chirish"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ModalWrapper name={MODAL.CAR_ASSIGNMENT_FORM} title="Mashina biriktirish" className="max-w-md">
        <CarAssignmentFormModal />
      </ModalWrapper>
      <ModalWrapper name={MODAL.CAR_ASSIGNMENT_DELETE} title="O'chirishni tasdiqlash" className="max-w-md">
        <CarAssignmentDeleteModal />
      </ModalWrapper>
    </div>
  );
};

export default DriverCarAssignmentsPage;

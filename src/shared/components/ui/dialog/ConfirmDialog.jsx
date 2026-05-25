import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import ModalWrapper from "@/shared/components/ui/modal/ModalWrapper";
import Button from "@/shared/components/ui/button/Button";
import { cn } from "@/shared/utils/cn";

const ConfirmBody = ({
  close,
  description,
  confirmLabel,
  cancelLabel,
  tone,
  onConfirm,
  ...data
}) => {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await onConfirm?.(data, { close });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center size-10 rounded-full",
            tone === "danger"
              ? "bg-red-50 text-red-600"
              : "bg-amber-50 text-amber-600",
          )}
        >
          <AlertTriangle size={20} strokeWidth={1.5} />
        </div>
        <p className="text-sm text-gray-700 pt-1.5">{description}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => close()}
          disabled={busy}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={tone === "danger" ? "danger" : "default"}
          className="flex-1"
          onClick={handleConfirm}
          disabled={busy}
        >
          {busy ? "Bajarilmoqda..." : confirmLabel}
        </Button>
      </div>
    </div>
  );
};

const ConfirmDialog = ({
  name,
  title = "Tasdiqlash",
  description = "Davom etishni xohlaysizmi?",
  confirmLabel = "Tasdiqlash",
  cancelLabel = "Bekor qilish",
  tone = "default",
  onConfirm,
  className = "max-w-md",
}) => {
  return (
    <ModalWrapper name={name} title={title} className={className}>
      <ConfirmBody
        description={description}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        tone={tone}
        onConfirm={onConfirm}
      />
    </ModalWrapper>
  );
};

export default ConfirmDialog;

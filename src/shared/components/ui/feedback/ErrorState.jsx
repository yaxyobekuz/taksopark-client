import { TriangleAlert, RotateCw } from "lucide-react";
import Button from "@/shared/components/ui/button/Button";
import { cn } from "@/shared/utils/cn";

const ErrorState = ({
  title = "Xato yuz berdi",
  message = "Ma'lumotni yuklab bo'lmadi",
  onRetry = null,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-10 px-4",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-center size-14 rounded-full bg-red-50 text-red-600">
        <TriangleAlert size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {message && (
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">{message}</p>
      )}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          <RotateCw size={16} strokeWidth={1.5} />
          Qayta urinish
        </Button>
      )}
    </div>
  );
};

export default ErrorState;

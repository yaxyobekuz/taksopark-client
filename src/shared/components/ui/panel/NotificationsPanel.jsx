import { Link } from "react-router-dom";
import {
  CalendarClock,
  CheckCircle2,
  Car as CarIcon,
  X,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/shared/components/shadcn/sheet";
import { Skeleton } from "@/shared/components/shadcn/skeleton";
import PlateNumber from "@/shared/components/ui/plate/PlateNumber";
import EmptyState from "@/shared/components/ui/feedback/EmptyState";
import { formatDateUZ } from "@/shared/utils/date.utils";
import { buildFileUrl } from "@/shared/utils/fileUrl";
import { getDaysLeft } from "@/owner/features/cars/utils/expiryStatus";

const CarAvatar = ({ car, size = 28 }) => {
  const src = buildFileUrl(car?.photoUrl);
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={{ width: size, height: size }}
        className="rounded-md object-cover border shrink-0 bg-white"
      />
    );
  }
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0 border"
    >
      <CarIcon size={Math.round(size * 0.55)} />
    </div>
  );
};

const SectionTitle = ({ icon: Icon, iconClassName, children }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon size={18} className={iconClassName} />
    <h3 className="text-sm font-semibold text-foreground">{children}</h3>
  </div>
);

const LoadingRows = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-2.5 py-2">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
);

const NotificationsPanel = ({
  open,
  onOpenChange,
  expiringCars = [],
  isLoading = false,
}) => {
  const hasCarWarnings = expiringCars.length > 0;
  const isEmpty = !isLoading && !hasCarWarnings;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        <SheetHeader className="px-5 py-4 border-b sticky top-0 bg-background z-20 flex-row items-center justify-between space-y-0">
          <SheetTitle>Eslatmalar</SheetTitle>
          <SheetClose
            aria-label="Yopish"
            className="flex items-center justify-center size-8 rounded-md text-muted-foreground hover:bg-muted/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X size={18} />
          </SheetClose>
        </SheetHeader>

        <div className="p-5 space-y-6">
          {isLoading && <LoadingRows />}

          {isEmpty && (
            <EmptyState
              icon={CheckCircle2}
              title="Hammasi joyida"
              description="Hozircha diqqat talab qiluvchi ogohlantirishlar yo'q"
            />
          )}

          {!isLoading && hasCarWarnings && (
            <div>
              <SectionTitle icon={CalendarClock} iconClassName="text-red-600">
                Muddati tugayotgan mashinalar
              </SectionTitle>

              <div className="divide-y rounded-lg border p-2">
                {expiringCars.map((car) => {
                  const expiring = car.expiringDocument;
                  if (!expiring?.expiryDate) return null;
                  const days = getDaysLeft(expiring.expiryDate);
                  const expired = days < 0;
                  const label = expiring.documentType?.name || "Hujjat";
                  return (
                    <Link
                      key={car._id}
                      to={`/owner/cars/${car._id}`}
                      className="flex items-center justify-between gap-3 py-2 rounded-md hover:bg-muted/60 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CarAvatar car={car} size={36} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                            {car.model}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {label}: {formatDateUZ(expiring.expiryDate)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span
                          className={`text-xs font-medium ${
                            expired ? "text-red-600" : "text-amber-700"
                          }`}
                        >
                          {expired
                            ? `${-days} kun o'tgan`
                            : `${days} kun qoldi`}
                        </span>
                        {car.plateNumber && (
                          <PlateNumber value={car.plateNumber} size="sm" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;

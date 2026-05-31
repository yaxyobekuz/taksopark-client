// Router
import { useNavigate } from "react-router-dom";

// Icons
import { Car, User } from "lucide-react";

// Components
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from "@/shared/components/shadcn/command";

// Hooks
import { useDriversQuery } from "@/owner/features/drivers";
import { useCarsQuery } from "@/owner/features/cars";

// Constants
import { MODAL } from "@/shared/constants/modals";

// Utils
import { formatPhone } from "@/shared/utils/formatPhone";

const GlobalSearchModal = ({ close }) => {
  const navigate = useNavigate();
  const { data: driversData, isLoading: driversLoading } = useDriversQuery({
    limit: 500,
  });
  const { data: carsData, isLoading: carsLoading } = useCarsQuery({
    limit: 500,
  });

  const drivers = driversData?.data || [];
  const cars = carsData?.data || [];
  const isLoading = driversLoading || carsLoading;

  const goTo = (url) => {
    close(MODAL.GLOBAL_SEARCH);
    navigate(url);
  };

  return (
    <Command shouldFilter={!isLoading} className="rounded-md border">
      <CommandInput placeholder="Haydovchi yoki mashina qidirish..." />
      <CommandList className="max-h-[60vh]">
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Yuklanmoqda...
          </p>
        ) : (
          <>
            <CommandEmpty>Hech narsa topilmadi</CommandEmpty>

            <CommandGroup heading="Haydovchilar">
              {drivers.map((d) => (
                <CommandItem
                  key={d._id}
                  value={`haydovchi ${d.firstName} ${d.lastName} ${d.car?.plateNumber || ""} ${d.phone || ""}`}
                  onSelect={() => goTo(`/owner/drivers/${d._id}`)}
                >
                  <User className="size-4 shrink-0 opacity-60" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">
                      {d.firstName} {d.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {d.car?.plateNumber || "Mashina yo'q"}
                      {d.phone ? ` · ${formatPhone(d.phone)}` : ""}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Mashinalar">
              {cars.map((c) => (
                <CommandItem
                  key={c._id}
                  value={`mashina ${c.model || ""} ${c.plateNumber || ""}`}
                  onSelect={() => goTo(`/owner/cars/${c._id}`)}
                >
                  <Car className="size-4 shrink-0 opacity-60" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{c.model || "-"}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {c.plateNumber || "Raqam yo'q"}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
};

export default GlobalSearchModal;

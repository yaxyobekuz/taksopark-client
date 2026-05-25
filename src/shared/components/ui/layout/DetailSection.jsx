import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/shadcn/collapsible";
import { cn } from "@/shared/utils/cn";

const DetailSection = ({
  title,
  icon: Icon = null,
  defaultOpen = true,
  collapsible = true,
  actions = null,
  children,
  className = "",
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible
      open={collapsible ? open : true}
      onOpenChange={collapsible ? setOpen : undefined}
      className={cn(
        "bg-white border rounded-[2px] overflow-hidden",
        className,
        open ? "h-full" : "h-auto",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between px-4 xs:px-5 py-3 bg-gray-50/60",
          open ? "border-b" : "",
        )}
      >
        <CollapsibleTrigger
          asChild
          disabled={!collapsible}
          className="flex items-center gap-2 text-left group"
        >
          <button type="button" className="flex items-center gap-2 w-full">
            {Icon && (
              <Icon
                size={18}
                strokeWidth={1.5}
                className="text-gray-600 shrink-0"
              />
            )}

            <h2 className="font-semibold text-sm text-gray-900 truncate">
              {title}
            </h2>

            {collapsible && (
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className={cn(
                  "text-gray-500 transition-transform",
                  open ? "rotate-180" : "",
                )}
              />
            )}
          </button>
        </CollapsibleTrigger>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
      <CollapsibleContent>
        <div className="p-4 xs:p-5">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DetailSection;

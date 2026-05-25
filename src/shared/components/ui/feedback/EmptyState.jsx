import { Inbox } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "Ma'lumot yo'q",
  description = "",
  action = null,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-10 px-4",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-center size-14 rounded-full bg-muted text-muted-foreground">
        <Icon size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;

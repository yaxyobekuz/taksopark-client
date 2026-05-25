import { cn } from "@/shared/utils/cn";

const PageHeader = ({
  title,
  description = "",
  actions = null,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      )}
    </div>
  );
};

export default PageHeader;

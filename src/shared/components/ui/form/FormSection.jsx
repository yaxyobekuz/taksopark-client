import { cn } from "@/shared/utils/cn";

const FormSection = ({
  title = "",
  description = "",
  children,
  className = "",
}) => {
  return (
    <fieldset className={cn("space-y-3", className)}>
      {(title || description) && (
        <legend className="px-1">
          {title && (
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              {title}
            </span>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </legend>
      )}
      <div className="space-y-3">{children}</div>
    </fieldset>
  );
};

export default FormSection;

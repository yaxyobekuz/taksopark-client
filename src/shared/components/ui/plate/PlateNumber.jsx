import { cn } from "@/shared/utils/cn";

const normalize = (raw) =>
  String(raw || "")
    .replace(/[\s\-_.]+/g, "")
    .toUpperCase();

const PLATE_RX = /^(\d{2})([A-Z])(\d{3})([A-Z]{2})$/;

const parsePlate = (raw) => {
  const value = normalize(raw);
  const match = value.match(PLATE_RX);
  if (!match) return null;
  const [, region, letter, digits, suffix] = match;
  return { region, main: `${letter} ${digits} ${suffix}` };
};

const SIZES = {
  sm: {
    wrap: "h-6 text-[11px]",
    region: "px-1.5 min-w-[26px]",
    main: "px-2",
    uz: "px-1 text-[9px]",
  },
  md: {
    wrap: "h-8 text-sm",
    region: "px-2 min-w-[34px]",
    main: "px-3",
    uz: "px-1.5 text-[10px]",
  },
  lg: {
    wrap: "h-10 text-base",
    region: "px-2.5 min-w-[42px]",
    main: "px-4",
    uz: "px-2 text-xs",
  },
};

const UZFlag = ({ className = "" }) => (
  <svg
    viewBox="0 0 30 15"
    className={cn("h-full w-auto p-px", className)}
    aria-hidden
  >
    <rect width="30" height="5" fill="#1eb53a" y="10" />
    <rect width="30" height="5" fill="#fff" y="5" />
    <rect width="30" height="5" fill="#0099b5" />
    <rect width="30" height="0.4" fill="#ce1126" y="4.8" />
    <rect width="30" height="0.4" fill="#ce1126" y="9.8" />
  </svg>
);

const PlateNumber = ({ value, size = "md", className = "" }) => {
  const sz = SIZES[size] || SIZES.md;
  const parsed = parsePlate(value);

  // Fallback: pattern noto'g'ri yoki bo'sh
  if (!parsed) {
    const display = String(value || "").trim() || "-";
    return (
      <span
        className={cn(
          "inline-flex items-center font-bold tracking-wider rounded-md bg-white text-gray-900 border-2 border-gray-900",
          sz.wrap,
          sz.main,
          className,
        )}
      >
        {display}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-stretch font-bold tracking-wider rounded-md bg-white text-gray-900 border-2 border-gray-900 overflow-hidden select-none",
        sz.wrap,
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center border-r-2 border-gray-900",
          sz.region,
        )}
      >
        {parsed.region}
      </span>
      <span className={cn("inline-flex items-center justify-center", sz.main)}>
        {parsed.main}
      </span>
      <span
        className={cn(
          "inline-flex flex-col items-center justify-center border-l-2 border-gray-900 bg-white",
          sz.uz,
        )}
      >
        <UZFlag className="mb-px" />
        <span className="font-semibold text-[#0099b5] leading-none">UZ</span>
      </span>
    </span>
  );
};

export default PlateNumber;

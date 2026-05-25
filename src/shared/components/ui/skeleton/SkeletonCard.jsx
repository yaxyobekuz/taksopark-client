import { Skeleton } from "@/shared/components/shadcn/skeleton";

const SkeletonCard = ({ count = 1, className = "" }) => {
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={`bg-white p-4 xs:p-5 rounded-[2px] border space-y-3 ${className}`}
    >
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  ));
};

export default SkeletonCard;

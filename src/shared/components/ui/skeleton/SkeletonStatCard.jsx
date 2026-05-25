import { Skeleton } from "@/shared/components/shadcn/skeleton";

const SkeletonStatCard = ({ count = 4 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className="bg-white p-4 rounded-[2px] border space-y-2"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="size-6 rounded-full" />
      </div>
      <Skeleton className="h-6 w-28" />
    </div>
  ));
};

export default SkeletonStatCard;

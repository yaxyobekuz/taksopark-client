import { Skeleton } from "@/shared/components/shadcn/skeleton";

const SkeletonTableRow = ({ count = 5, columns = 5 }) => {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i} className="border-b">
      {Array.from({ length: columns }).map((__, j) => (
        <td key={j} className="px-3 py-3">
          <Skeleton className="h-3 w-full" />
        </td>
      ))}
    </tr>
  ));
};

export default SkeletonTableRow;

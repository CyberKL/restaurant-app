import { Skeleton } from "@/components/ui/skeleton";

export default function MenuItemSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-12 max-w-lg py-4">
        <div className="col-span-9 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-60" />
              <Skeleton className="h-4 w-60" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="place-content-center col-span-3">
          <Skeleton className="rounded-full size-32" />
        </div>
      </div>
    </div>
  );
}

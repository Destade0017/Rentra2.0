import { Skeleton } from '@/components/ui/skeleton';

export default function TenantsLoading() {
  return (
    <div className="flex-1 space-y-12 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="space-y-1">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-4 w-60 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-40 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-10 rounded-xl" />
              <Skeleton className="h-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

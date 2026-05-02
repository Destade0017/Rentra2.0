import { Skeleton } from '@/components/ui/skeleton';

export default function PaymentsLoading() {
  return (
    <div className="flex-1 space-y-12 pb-24 animate-in fade-in duration-500">
      <div className="px-1">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <Skeleton className="h-4 w-60 mt-2 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-4 w-32 rounded-lg mx-1" />
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-5 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4 rounded-lg" />
                <Skeleton className="h-3 w-1/6 rounded-lg" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <Skeleton className="h-4 w-16 rounded-lg ml-auto" />
              <Skeleton className="h-3 w-12 rounded-lg ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

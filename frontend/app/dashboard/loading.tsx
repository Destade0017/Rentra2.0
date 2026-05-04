import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="flex-1 max-w-[1000px] mx-auto w-full space-y-12 pb-24 animate-in fade-in duration-500">
      <div className="space-y-8">
        <div className="px-1">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-4 w-64 mt-2 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-5 lg:p-6 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-1/3 rounded-lg" />
                <Skeleton className="h-6 w-1/2 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-4 w-32 rounded-lg mx-1" />
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
          {[1, 2].map(i => (
            <div key={i} className="p-6 lg:p-8 bg-white rounded-2xl border border-slate-50 shadow-sm flex flex-col gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/2 rounded-lg" />
                <Skeleton className="h-3 w-1/3 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

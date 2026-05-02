import { Skeleton } from '@/components/ui/skeleton';

export default function PropertiesLoading() {
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
          <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <Skeleton className="aspect-[16/9] w-full" />
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-lg" />
              </div>
              <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <Skeleton className="h-4 w-16 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24 rounded-xl" />
                  <Skeleton className="h-9 w-20 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

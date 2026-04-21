import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-slate-900 placeholder:text-slate-400 selection:bg-indigo-100 selection:text-indigo-900 border-slate-200 h-11 w-full min-w-0 rounded-xl border bg-slate-50/30 px-4 py-2 text-base shadow-none transition-all outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus:ring-4 focus:ring-primary/10 focus:border-primary',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

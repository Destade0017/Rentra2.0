import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-indigo-600/10",
  {
    variants: {
      variant: {
        default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:shadow-indigo-200/50',
        destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100',
        outline: 'border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200/50',
        ghost: 'hover:bg-slate-50 text-slate-500 hover:text-indigo-600',
        link: 'text-indigo-600 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 has-[>svg]:px-4',
        sm: 'h-9 px-4 has-[>svg]:px-3.5',
        lg: 'h-12 px-8 text-base has-[>svg]:px-6 rounded-2xl',
        xl: 'h-14 px-10 text-base rounded-2xl shadow-xl',
        icon: 'size-10',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {typeof children === 'string' ? <span>Processing...</span> : children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }

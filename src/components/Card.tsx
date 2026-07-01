import type { ReactNode } from 'react'

interface CardProps {
  title?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}

/** Shared frosted-glass widget container used by every dashboard tile. */
export function Card({
  title,
  icon,
  action,
  className = '',
  bodyClassName = '',
  children,
}: CardProps) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm ring-1 ring-black/[0.02] backdrop-blur-md transition-shadow hover:shadow-md dark:border-white/10 dark:bg-slate-800/60 dark:ring-white/5 ${className}`}
    >
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon && <span className="text-slate-500 dark:text-slate-400">{icon}</span>}
            {title && (
              <h2 className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-200">
                {title}
              </h2>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  )
}

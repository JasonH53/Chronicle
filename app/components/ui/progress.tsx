import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "minecraft-progress h-6 w-full",
      className,
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="minecraft-progress-fill h-full transition-all duration-500"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
    {/* Add pixel-like segments to the progress bar */}
    <div className="absolute inset-0 flex">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="flex-1 border-r border-border/30 last:border-r-0"
          style={{ opacity: (value || 0) > (i * 5) ? 1 : 0.3 }}
        />
      ))}
    </div>
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

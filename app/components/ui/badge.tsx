import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border-2 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-minecraft transition-all duration-75 w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary-foreground/30 bg-primary text-primary-foreground [a&]:hover:shadow-minecraft-hover [a&]:active:shadow-minecraft-pressed",
        secondary:
          "border-secondary-foreground/30 bg-secondary text-secondary-foreground [a&]:hover:shadow-minecraft-hover [a&]:active:shadow-minecraft-pressed",
        destructive:
          "border-destructive-foreground/30 bg-destructive text-destructive-foreground [a&]:hover:shadow-minecraft-hover [a&]:active:shadow-minecraft-pressed",
        outline:
          "text-foreground border-border bg-background [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

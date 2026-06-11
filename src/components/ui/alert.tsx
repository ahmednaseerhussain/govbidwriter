import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("relative w-full rounded-lg border p-4 text-sm", {
  variants: {
    variant: {
      default: "bg-muted/50 text-foreground",
      info: "border-primary/30 bg-primary/5 text-primary",
      success: "border-success/30 bg-success/5 text-success",
      destructive: "border-destructive/40 bg-destructive/5 text-destructive",
      warning: "border-amber-400/50 bg-amber-50 text-amber-900",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Alert({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

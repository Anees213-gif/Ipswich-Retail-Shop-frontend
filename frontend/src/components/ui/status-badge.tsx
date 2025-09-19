import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20", 
        error: "bg-destructive/10 text-destructive border border-destructive/20",
        info: "bg-info/10 text-info border border-info/20",
        neutral: "bg-muted text-muted-foreground border border-border",
        pending: "bg-warning/10 text-warning border border-warning/20",
        shipped: "bg-info/10 text-info border border-info/20",
        delivered: "bg-success/10 text-success border border-success/20",
        cancelled: "bg-destructive/10 text-destructive border border-destructive/20",
        confirmed: "bg-info/10 text-info border border-info/20",
        inStock: "bg-success/10 text-success border border-success/20",
        outOfStock: "bg-destructive/10 text-destructive border border-destructive/20",
        lowStock: "bg-warning/10 text-warning border border-warning/20"
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5"
      }
    },
    defaultVariants: {
      variant: "neutral",
      size: "md"
    }
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean;
}

export function StatusBadge({ 
  className, 
  variant, 
  size, 
  showDot = true, 
  children, 
  ...props 
}: StatusBadgeProps) {
  const dotColorMap = {
    success: "bg-success",
    warning: "bg-warning", 
    error: "bg-destructive",
    info: "bg-info",
    neutral: "bg-muted-foreground",
    pending: "bg-warning",
    shipped: "bg-info", 
    delivered: "bg-success",
    cancelled: "bg-destructive",
    confirmed: "bg-info",
    inStock: "bg-success",
    outOfStock: "bg-destructive",
    lowStock: "bg-warning"
  };

  return (
    <div className={cn(statusBadgeVariants({ variant, size }), className)} {...props}>
      {showDot && variant && (
        <div className={cn("w-1.5 h-1.5 rounded-full", dotColorMap[variant])} />
      )}
      {children}
    </div>
  );
}
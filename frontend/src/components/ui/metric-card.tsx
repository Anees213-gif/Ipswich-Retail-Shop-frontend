import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    period: string;
  };
  icon?: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "destructive";
  className?: string;
  loading?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  icon, 
  variant = "default",
  className,
  loading = false
}: MetricCardProps) {
  const variantClasses = {
    default: "border-border",
    accent: "border-accent/20 bg-accent/5",
    success: "border-success/20 bg-success/5", 
    warning: "border-warning/20 bg-warning/5",
    destructive: "border-destructive/20 bg-destructive/5"
  };

  const getTrendIcon = () => {
    if (!change) return null;
    if (change.value > 0) return <TrendingUp className="h-3 w-3 text-success" />;
    if (change.value < 0) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (!change) return "text-muted-foreground";
    if (change.value > 0) return "text-success";
    if (change.value < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  if (loading) {
    return (
      <Card className={cn("card-elevated animate-pulse", className)}>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
            <div className="h-8 bg-muted rounded w-24"></div>
            <div className="h-3 bg-muted rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("card-elevated transition-all duration-200 hover:shadow-lg", variantClasses[variant], className)}>
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {icon && (
              <div className="p-2 rounded-lg bg-muted/50">
                {icon}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            
            {change && (
              <div className="flex items-center gap-1 text-xs">
                {getTrendIcon()}
                <span className={getTrendColor()}>
                  {change.value > 0 ? '+' : ''}{change.value}% {change.label}
                </span>
                <span className="text-muted-foreground">vs {change.period}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
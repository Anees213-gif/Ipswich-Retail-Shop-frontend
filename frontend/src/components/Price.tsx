// Price component with currency formatting
import { cn } from '@/lib/utils';

interface PriceProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function Price({ 
  price, 
  originalPrice, 
  currency = 'USD', 
  size = 'default',
  className 
}: PriceProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const sizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-xl'
  };

  const originalSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('font-semibold text-foreground', sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className={cn(
          'line-through text-muted-foreground',
          originalSizeClasses[size]
        )}>
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}
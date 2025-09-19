// Rating stars component
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'default' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function RatingStars({ 
  rating, 
  maxRating = 5, 
  size = 'default', 
  showValue = false,
  className 
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center" role="img" aria-label={`${rating} out of ${maxRating} stars`}>
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const filled = starValue <= rating;
          const partiallyFilled = starValue - 1 < rating && starValue > rating;
          
          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                'transition-colors',
                filled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : partiallyFilled
                  ? 'fill-yellow-200 text-yellow-400'
                  : 'fill-none text-muted-foreground'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-medium', textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
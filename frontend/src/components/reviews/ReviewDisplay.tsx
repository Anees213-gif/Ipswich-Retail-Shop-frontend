import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { RatingStars } from "@/components/RatingStars";
import { ThumbsUp, ThumbsDown, MoreVertical, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Review } from "@/types";

interface ReviewDisplayProps {
  reviews: Review[];
  loading?: boolean;
  className?: string;
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(review.author)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{review.author}</h4>
                {review.verified && (
                  <Badge variant="outline" className="text-xs text-success border-success/20">
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {review.title && (
            <h5 className="font-medium text-sm">{review.title}</h5>
          )}
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.content}
          </p>
          
          <div className="flex items-center gap-4 pt-2">
            <Button variant="ghost" size="sm" className="text-xs gap-1 h-8">
              <ThumbsUp className="h-3 w-3" />
              Helpful (0)
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1 h-8">
              <ThumbsDown className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 ml-auto">
              <Flag className="h-3 w-3" />
              Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewDisplay({ reviews, loading = false, className }: ReviewDisplayProps) {
  if (loading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-48" />
                  <div className="h-16 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={className}>
        <Card className="card-elevated">
          <CardContent className="py-12 text-center">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">No reviews yet</h3>
              <p className="text-muted-foreground">
                Be the first to share your thoughts about this product.
              </p>
              <Button variant="outline" className="mt-4">
                Write a Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
      {reviews.length > 5 && (
        <div className="mt-6 text-center">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
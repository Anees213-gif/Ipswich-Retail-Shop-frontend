import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface WishlistButtonProps {
  productId: string;
  productName: string;
  isWishlisted?: boolean;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  productName,
  isWishlisted = false,
  variant = "ghost",
  size = "default",
  showLabel = false,
  className
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(isWishlisted);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleWishlist = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newWishlistState = !wishlisted;
      setWishlisted(newWishlistState);
      
      toast({
        title: newWishlistState ? "Added to wishlist" : "Removed from wishlist",
        description: newWishlistState 
          ? `${productName} has been added to your wishlist.`
          : `${productName} has been removed from your wishlist.`,
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        wishlisted && "text-destructive hover:text-destructive/80",
        className
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-all duration-200",
          wishlisted && "fill-current",
          isLoading && "animate-pulse"
        )} 
      />
      {showLabel && (
        <span className="ml-1">
          {wishlisted ? "Wishlisted" : "Add to Wishlist"}
        </span>
      )}
    </Button>
  );
}
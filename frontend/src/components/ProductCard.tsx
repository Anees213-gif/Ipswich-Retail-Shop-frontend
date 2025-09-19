// ProductCard component for displaying products in grids
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types';
import { Price } from './Price';

interface ProductCardProps {
  product: Product;
  className?: string;
  showQuickAdd?: boolean;
}

export function ProductCard({ product, className, showQuickAdd = true }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.in_stock) return;

    setIsLoading(true);
    
    try {
      addItem(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStockBadge = () => {
    if (!product.in_stock) {
      return <Badge variant="outOfStock">Out of Stock</Badge>;
    }
    if (product.stock_count <= 5) {
      return <Badge variant="lowStock">Low Stock</Badge>;
    }
    return null;
  };

  const getDiscountPercentage = () => {
    if (!product.original_price) return null;
    const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
    return discount > 0 ? discount : null;
  };

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={
              product.primary_image?.image 
                ? product.primary_image.image.startsWith('http') 
                  ? product.primary_image.image 
                  : `http://localhost:8000${product.primary_image.image}`
                : `https://picsum.photos/400/400?random=${product.id}`
            }
            alt={product.primary_image?.alt_text || product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              // Fallback to a different placeholder service if the first one fails
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/400x400/cccccc/666666?text=${encodeURIComponent(product.name)}`;
            }}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_featured && <Badge variant="featured">Featured</Badge>}
            {getDiscountPercentage() && (
              <Badge variant="sale">{getDiscountPercentage()}% OFF</Badge>
            )}
          </div>

          {/* Stock badge */}
          <div className="absolute top-3 right-3">
            {getStockBadge()}
          </div>

          {/* Wishlist button */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-3 right-3 bg-white/80 hover:bg-white transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // TODO: Implement wishlist functionality
            }}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>

          {/* Quick add to cart overlay */}
          {showQuickAdd && product.in_stock && (
            <div className={`absolute inset-x-3 bottom-3 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}>
              <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full"
                variant="cart"
                size="sm"
              >
                <ShoppingCart className="h-4 w-4" />
                {isLoading ? 'Adding...' : 'Quick Add'}
              </Button>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Category */}
            <Badge variant="category" className="text-xs">
              {product.category.name}
            </Badge>

            {/* Product name */}
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>


            {/* Price */}
            <div className="flex items-center gap-2">
              <Price 
                price={product.price} 
                originalPrice={product.original_price}
                size="sm"
              />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
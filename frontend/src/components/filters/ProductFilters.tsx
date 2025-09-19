import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Filter, SlidersHorizontal } from "lucide-react";
import { ProductFilters as FilterType } from "@/types";

interface ProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  categories: string[];
  priceRange: { min: number; max: number };
  isLoading?: boolean;
  className?: string;
}

export function ProductFilters({
  filters,
  onFiltersChange,
  categories,
  priceRange,
  isLoading = false,
  className
}: ProductFiltersProps) {
  const [localPriceRange, setLocalPriceRange] = useState([
    filters.minPrice || priceRange.min,
    filters.maxPrice || priceRange.max
  ]);

  const handlePriceChange = (values: number[]) => {
    setLocalPriceRange(values);
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1]
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
    setLocalPriceRange([priceRange.min, priceRange.max]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.minRating) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search Filter */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">
            Search Products
          </Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="Search by name, description..."
              value={filters.search || ""}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              disabled={isLoading}
            />
            {filters.search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-6 w-6 p-0"
                onClick={() => onFiltersChange({ ...filters, search: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Category Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Select
            value={filters.category || ""}
            onValueChange={(value) => 
              onFiltersChange({ 
                ...filters, 
                category: value === "all" ? undefined : value 
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="px-2">
            <Slider
              value={localPriceRange}
              onValueChange={handlePriceChange}
              max={priceRange.max}
              min={priceRange.min}
              step={1}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${localPriceRange[0]}</span>
            <span>${localPriceRange[1]}</span>
          </div>
        </div>

        <Separator />

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Minimum Rating</Label>
          <Select
            value={filters.minRating?.toString() || ""}
            onValueChange={(value) => 
              onFiltersChange({ 
                ...filters, 
                minRating: value === "all" ? undefined : parseFloat(value)
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any rating</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="3.5">3.5+ stars</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Sort Options */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sort By</Label>
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={(value) => 
              onFiltersChange({ 
                ...filters, 
                sortBy: value as FilterType['sortBy']
              })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-1">
                {filters.search && (
                  <Badge variant="secondary" className="text-xs">
                    "{filters.search}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => onFiltersChange({ ...filters, search: undefined })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.category}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => onFiltersChange({ ...filters, category: undefined })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                  <Badge variant="secondary" className="text-xs">
                    ${filters.minPrice || priceRange.min} - ${filters.maxPrice || priceRange.max}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => onFiltersChange({ 
                        ...filters, 
                        minPrice: undefined, 
                        maxPrice: undefined 
                      })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.minRating && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.minRating}+ stars
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => onFiltersChange({ ...filters, minRating: undefined })}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/store/cart';
import { useTheme } from '@/components/ThemeProvider';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { 
  Search, 
  ShoppingCart, 
  Sun, 
  Moon, 
  Menu, 
  User,
  Heart,
  Package,
  Settings,
  Store,
  Sparkles,
  Monitor
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const itemCount = useCartStore((state) => state.itemCount);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const categories = [
    { 
      name: 'Electronics', 
      slug: 'electronics',
      description: 'Latest tech gadgets and devices',
      items: ['Headphones', 'Smartwatches', 'Laptops', 'Phones']
    },
    { 
      name: 'Apparel', 
      slug: 'apparel',
      description: 'Fashion and clothing for all',
      items: ['T-Shirts', 'Jeans', 'Dresses', 'Shoes']
    },
    { 
      name: 'Books', 
      slug: 'books',
      description: 'Knowledge and entertainment',
      items: ['Fiction', 'Non-Fiction', 'Technical', 'Children\'s']
    },
    { 
      name: 'Accessories', 
      slug: 'accessories',
      description: 'Complete your style',
      items: ['Wallets', 'Bags', 'Jewelry', 'Watches']
    },
    { 
      name: 'Home & Garden', 
      slug: 'home-garden',
      description: 'Make your space beautiful',
      items: ['Furniture', 'Decor', 'Kitchen', 'Garden']
    }
  ];

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/products?category=${categorySlug}`);
    setIsMobileMenuOpen(false);
  };

  const ThemeToggle = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="focus-ring">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-popover border border-border">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              IR
            </div>
            <span className="text-xl font-bold">Ipswich Retail</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="focus-ring">
                  Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover border border-border">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.slug}
                    onClick={() => handleCategoryClick(category.slug)}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              All Products
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 focus-ring"
                aria-label="Search products"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {/* Admin Link */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex focus-ring"
              asChild
            >
              <Link to="/admin/login">
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
            
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative focus-ring"
              asChild
            >
              <Link to="/cart" aria-label={`Cart with ${itemCount} items`}>
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden focus-ring">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/" 
                    className="flex items-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      IR
                    </div>
                    <span className="font-bold">Ipswich Retail</span>
                  </Link>

                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    <Link
                      to="/products"
                      className="px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      All Products
                    </Link>
                    
                    <Link
                      to="/admin/login"
                      className="px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                    
                    <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                      Categories
                    </div>
                    
                    {categories.map((category) => (
                      <button
                        key={category.slug}
                        onClick={() => handleCategoryClick(category.slug)}
                        className="flex items-center justify-between px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left"
                      >
                        {category.name}
                        
                      </button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
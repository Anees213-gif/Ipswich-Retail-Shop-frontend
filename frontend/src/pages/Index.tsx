// Home page for Ipswich Retail
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, Truck, Shield, HeartHandshake, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { Layout } from '@/components/Layout';
import { api } from '@/lib/api';
import type { Product, Category } from '@/types';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts({ featured: true, pageSize: 6 }),
          api.getCategories()
        ]);
        
        setFeaturedProducts(productsData.products || []);
        setCategories(categoriesData || []);
      } catch (error) {
        // Failed to load homepage data
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <Layout>
      {/* Hero Section with Background Image */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-bg"
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        {/* Content */}
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center text-white">
            <Badge variant="featured" className="mb-6 animate-fade-up bg-white/20 text-white border-white/30 backdrop-blur-sm">
              ✨ Trusted by 10,000+ Customers
            </Badge>
            <h1 className="text-hero mb-6 animate-fade-up text-white">
              Discover Quality Products for
              <span className="text-yellow-400"> Every Lifestyle</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-up">
              From electronics to home essentials, find everything you need with fast shipping, 
              great prices, and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
              <Button variant="hero" size="xl" asChild>
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild className="border-white/50 text-white hover:bg-white/20 backdrop-blur-sm bg-white/10">
                <Link to="/products?featured=true">
                  <Star className="mr-2 h-5 w-5" />
                  Featured Products
                </Link>
              </Button>
            </div>
            
            {/* Admin Access - Development Only */}
            <div className="mt-8 animate-fade-up">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/login" className="text-gray-200 hover:text-white">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-b">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover-glow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Fast Shipping</h3>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $50. Most items delivered within 2-3 business days.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-glow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Secure Shopping</h3>
                <p className="text-sm text-muted-foreground">
                  Your personal information is protected with industry-standard encryption.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-glow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Customer First</h3>
                <p className="text-sm text-muted-foreground">
                  30-day returns, dedicated support, and satisfaction guarantee on all purchases.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections across all major categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group"
              >
                <Card className="hover-glow hover-lift text-center border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <span className="text-3xl font-bold text-white">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors text-gray-900">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {category.product_count} Premium Items
                    </p>
                    <div className="mt-3 text-xs text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore Collection →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Featured Collection
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked favorites that our customers love most
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link to="/products?featured=true">
                View All Featured
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg">
                  <div className="aspect-square bg-gray-200 rounded-t-lg" />
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="animate-scale-in">
                  <ProductCard product={product} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No featured products found</h3>
              <p className="text-muted-foreground mb-4">
                Check back later for our featured collection.
              </p>
              <Button asChild>
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 cta-pattern"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your
              <span className="block text-yellow-300">Shopping Experience?</span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join over 10,000 satisfied customers who trust us for their premium shopping needs. 
              Start your journey today with exclusive deals and fast delivery.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mb-10 text-blue-100">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                <span className="font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5" />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link to="/products">
                  <ShoppingBag className="mr-2 h-6 w-6" />
                  Start Shopping Now
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-white/50 hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-full text-gray-800 hover:text-gray-900 dark:text-white dark:hover:text-gray-100"
                asChild
              >
                <Link to="/products?featured=true">
                  <Star className="mr-2 h-6 w-6" />
                  View Featured Items
                </Link>
              </Button>
            </div>
            
            {/* Admin Access - Development Only */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/login" className="text-blue-200 hover:text-white">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

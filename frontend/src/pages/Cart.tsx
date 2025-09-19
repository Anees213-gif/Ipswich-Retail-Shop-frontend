// Shopping cart and checkout page
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, X, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/Layout';
import { Price } from '@/components/Price';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/hooks/use-toast';

const checkoutSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(5, 'Please enter a valid ZIP code'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Cart = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCartStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Calculate totals
  const subtotal = total;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const grandTotal = subtotal + shipping + tax;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsCheckingOut(true);
    
    try {
      // Mock checkout process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order placed successfully!",
        description: `Your order for $${grandTotal.toFixed(2)} has been confirmed.`,
      });
      
      clearCart();
      setShowCheckoutForm(false);
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="max-w-md mx-auto text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/products">Start Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">View Featured Products</Link>
              </Button>
            </div>
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Click "Add to Cart" on any product from the home page or products page to see items here.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={
                          item.product.primary_image?.image 
                            ? item.product.primary_image.image.startsWith('http') 
                              ? item.product.primary_image.image 
                              : `http://localhost:8000${item.product.primary_image.image}`
                            : `https://picsum.photos/80/80?random=${item.product.id}`
                        }
                        alt={item.product.primary_image?.alt_text || item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/80x80/cccccc/666666?text=${encodeURIComponent(item.product.name)}`;
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-sm mb-1">
                            <Link 
                              to={`/products/${item.product.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {item.product.name}
                            </Link>
                          </h3>
                          <Badge variant="category" className="text-xs">
                            {item.product.category.name}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stockCount}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <Price price={item.product.price} size="sm" />
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              ${(item.product.price * item.quantity).toFixed(2)} total
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-xs text-muted-foreground">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping
                    </p>
                  </div>
                )}

                {!showCheckoutForm ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowCheckoutForm(true)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Shipping Information</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            {...register('firstName')}
                            className={errors.firstName ? 'border-destructive' : ''}
                          />
                          {errors.firstName && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            {...register('lastName')}
                            className={errors.lastName ? 'border-destructive' : ''}
                          />
                          {errors.lastName && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register('email')}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          {...register('phone')}
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="address1">Address</Label>
                        <Input
                          id="address1"
                          {...register('address1')}
                          className={errors.address1 ? 'border-destructive' : ''}
                        />
                        {errors.address1 && (
                          <p className="text-xs text-destructive mt-1">
                            {errors.address1.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
                        <Input id="address2" {...register('address2')} />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            {...register('city')}
                            className={errors.city ? 'border-destructive' : ''}
                          />
                          {errors.city && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            {...register('state')}
                            className={errors.state ? 'border-destructive' : ''}
                          />
                          {errors.state && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            {...register('zipCode')}
                            className={errors.zipCode ? 'border-destructive' : ''}
                          />
                          {errors.zipCode && (
                            <p className="text-xs text-destructive mt-1">
                              {errors.zipCode.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button 
                          type="submit" 
                          className="w-full" 
                          size="lg"
                          disabled={isCheckingOut}
                        >
                          {isCheckingOut ? 'Processing...' : `Place Order - $${grandTotal.toFixed(2)}`}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowCheckoutForm(false)}
                          disabled={isCheckingOut}
                        >
                          Back to Cart
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
// Admin products management page
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { api } from '@/lib/api';
import type { Product } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Edit, Package, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newlyCreatedProduct, setNewlyCreatedProduct] = useState<Product | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await api.getAdminProducts({ pageSize: 50 });
      setProducts(data.products || []);
    } catch (error) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const newProduct = await api.createProduct({
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : undefined,
        stock_count: parseInt(formData.get('stock') as string),
        description: formData.get('description') as string,
        brand: formData.get('brand') as string,
        category_id: parseInt(formData.get('category') as string), // Category ID
        is_active: true,
        is_featured: false,
        rating: 0,
        review_count: 0,
      });
      
      setNewlyCreatedProduct(newProduct);
      setShowImageUpload(true);
      setActiveTab('images');
      loadProducts();
      toast({
        title: "Product created",
        description: "The product has been created successfully. You can now upload images.",
      });
    } catch (error) {
      console.error('Product creation error:', error);
      toast({
        title: "Creation failed",
        description: "Failed to create the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    const formData = new FormData(e.currentTarget);
    try {
      await api.updateProduct(selectedProduct.id.toString(), {
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : undefined,
        stock_count: parseInt(formData.get('stock_count') as string),
        description: formData.get('description') as string,
        brand: formData.get('brand') as string,
        category_id: parseInt(formData.get('category') as string),
        is_active: formData.get('is_active') === 'on',
        is_featured: formData.get('is_featured') === 'on',
      });
      setIsEditDialogOpen(false);
      loadProducts();
      toast({
        title: "Product updated",
        description: "The product has been updated successfully.",
      });
    } catch (error) {
      console.error('Product update error:', error);
      toast({
        title: "Update failed",
        description: "Failed to update the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.original.primary_image?.image || row.original.images?.[0]?.image || '/api/placeholder/40/40'} 
            alt={row.original.primary_image?.alt_text || row.original.name} 
            className="w-10 h-10 rounded object-cover" 
          />
          <div>
            <p className="font-medium">{row.getValue("name")}</p>
            <p className="text-sm text-muted-foreground">{row.original.category?.name || 'Uncategorized'}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
      },
    },
    {
      accessorKey: "stock_count",
      header: "Stock",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("is_active") ? "success" : "destructive"}>
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSelectedProduct(row.original);
              setIsEditDialogOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(`/products/${row.original.slug}`, '_blank')}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setNewlyCreatedProduct(null);
            setShowImageUpload(false);
            setActiveTab('details');
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" name="brand" placeholder="e.g., Apple, Samsung, Nike" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input id="price" name="price" type="number" step="0.01" required />
                    </div>
                    <div>
                      <Label htmlFor="original_price">Original Price (Optional)</Label>
                      <Input id="original_price" name="original_price" type="number" step="0.01" placeholder="For sale price" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Count</Label>
                    <Input id="stock" name="stock" type="number" required />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">Apparel</SelectItem>
                        <SelectItem value="8">Automotive</SelectItem>
                        <SelectItem value="6">Beauty & Health</SelectItem>
                        <SelectItem value="5">Books & Media</SelectItem>
                        <SelectItem value="1">Electronics</SelectItem>
                        <SelectItem value="3">Home & Garden</SelectItem>
                        <SelectItem value="4">Sports & Outdoors</SelectItem>
                        <SelectItem value="7">Toys & Games</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" rows={3} required />
                  </div>
                  <Button type="submit" className="w-full">Create Product</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="images" className="space-y-4">
                {newlyCreatedProduct ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">Product Created Successfully!</p>
                      <p className="text-green-600 text-sm">You can now upload images for "{newlyCreatedProduct.name}"</p>
                    </div>
                    <ImageUpload
                      productId={newlyCreatedProduct.id}
                      images={newlyCreatedProduct.images || []}
                      onImagesChange={(images) => {
                        setNewlyCreatedProduct({
                          ...newlyCreatedProduct,
                          images: images
                        });
                        // Update the products list
                        setProducts(products.map(p => 
                          p.id === newlyCreatedProduct.id 
                            ? { ...p, images: images }
                            : p
                        ));
                      }}
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsDialogOpen(false);
                          setNewlyCreatedProduct(null);
                          setShowImageUpload(false);
                          setActiveTab('details');
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Create the product first, then you can upload images.
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        // Submit the form first
                        const form = document.querySelector('form');
                        if (form) {
                          form.requestSubmit();
                        }
                      }}
                    >
                      Create Product First
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {products && products.length > 0 ? (
        <DataTable
          columns={columns}
          data={products}
          searchKey="name"
          searchPlaceholder="Search products..."
          enableExport={true}
          exportFilename="products.csv"
        />
      ) : (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first product.
          </p>
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product: {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <form onSubmit={handleUpdateProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">Product Name</Label>
                      <Input 
                        id="edit-name" 
                        name="name" 
                        defaultValue={selectedProduct.name}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-brand">Brand</Label>
                      <Input 
                        id="edit-brand" 
                        name="brand" 
                        defaultValue={selectedProduct.brand || ''}
                        placeholder="e.g., Apple, Samsung, Nike"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-price">Price</Label>
                      <Input 
                        id="edit-price" 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        defaultValue={selectedProduct.price}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-original-price">Original Price</Label>
                      <Input 
                        id="edit-original-price" 
                        name="original_price" 
                        type="number" 
                        step="0.01" 
                        defaultValue={selectedProduct.original_price || ''}
                        placeholder="For sale price"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-stock">Stock Count</Label>
                      <Input 
                        id="edit-stock" 
                        name="stock_count" 
                        type="number" 
                        defaultValue={selectedProduct.stock_count}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-category">Category</Label>
                      <Select name="category" defaultValue={selectedProduct.category?.id?.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">Apparel</SelectItem>
                          <SelectItem value="8">Automotive</SelectItem>
                          <SelectItem value="6">Beauty & Health</SelectItem>
                          <SelectItem value="5">Books & Media</SelectItem>
                          <SelectItem value="1">Electronics</SelectItem>
                          <SelectItem value="3">Home & Garden</SelectItem>
                          <SelectItem value="4">Sports & Outdoors</SelectItem>
                          <SelectItem value="7">Toys & Games</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea 
                      id="edit-description" 
                      name="description" 
                      defaultValue={selectedProduct.description}
                      rows={4}
                      required 
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="edit-active" 
                        name="is_active" 
                        defaultChecked={selectedProduct.is_active}
                        className="rounded"
                        aria-label="Product is active"
                      />
                      <Label htmlFor="edit-active">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="edit-featured" 
                        name="is_featured" 
                        defaultChecked={selectedProduct.is_featured}
                        className="rounded"
                        aria-label="Product is featured"
                      />
                      <Label htmlFor="edit-featured">Featured</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Update Product</Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="images">
                <ImageUpload
                  productId={selectedProduct.id}
                  images={selectedProduct.images || []}
                  onImagesChange={(images) => {
                    setSelectedProduct({
                      ...selectedProduct,
                      images: images
                    });
                    // Update the products list
                    setProducts(products.map(p => 
                      p.id === selectedProduct.id 
                        ? { ...p, images: images }
                        : p
                    ));
                  }}
                />
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
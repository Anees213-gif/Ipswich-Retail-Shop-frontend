// UI Kit showcase page
import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DataTable } from '@/components/DataTable';
import { StatsCard } from '@/components/StatsCard';
import { EmptyState } from '@/components/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Download, 
  Search, 
  Plus, 
  Star, 
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

interface SampleData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  amount: number;
  date: string;
}

const sampleData: SampleData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    amount: 299.99,
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'pending',
    amount: 149.50,
    date: '2024-01-14'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    status: 'inactive',
    amount: 89.99,
    date: '2024-01-13'
  }
];

const UIKit = () => {
  const [progress, setProgress] = useState(65);
  const [isChecked, setIsChecked] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const { toast } = useToast();

  const columns: ColumnDef<SampleData>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={status === 'active' ? 'success' : status === 'pending' ? 'secondary' : 'destructive'}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return formatted;
      },
    },
    {
      accessorKey: "date",
      header: "Date",
    },
  ];

  const showToast = (variant: 'default' | 'destructive' = 'default') => {
    toast({
      title: "Toast Notification",
      description: `This is a ${variant} toast message.`,
      variant,
    });
  };

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">UI Kit</h1>
          <p className="text-xl text-muted-foreground">
            Component library for Ipswich Retail admin interface
          </p>
        </div>

        <Tabs defaultValue="buttons" className="space-y-8">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="modals">Modals</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Buttons */}
          <TabsContent value="buttons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Button Variants</CardTitle>
                <CardDescription>Different button styles and sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="cta">CTA</Button>
                    <Button variant="cart">Cart</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">Sizes</h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                    <Button size="icon"><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">With Icons</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                    <Button variant="destructive">
                      Delete
                      <Star className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>Input fields, selects, and form layouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="text-input">Text Input</Label>
                      <Input id="text-input" placeholder="Enter text..." />
                    </div>
                    
                    <div>
                      <Label htmlFor="email-input">Email Input</Label>
                      <Input id="email-input" type="email" placeholder="Enter email..." />
                    </div>
                    
                    <div>
                      <Label htmlFor="password-input">Password Input</Label>
                      <Input id="password-input" type="password" placeholder="Enter password..." />
                    </div>
                    
                    <div>
                      <Label htmlFor="error-input">Input with Error</Label>
                      <Input id="error-input" placeholder="This has an error" className="border-destructive" />
                      <p className="text-sm text-destructive mt-1">This field is required</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="select">Select</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="textarea">Textarea</Label>
                      <Textarea id="textarea" placeholder="Enter description..." />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="checkbox" 
                        checked={isChecked}
                        onCheckedChange={(checked) => setIsChecked(checked === true)}
                      />
                      <Label htmlFor="checkbox">Accept terms and conditions</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="switch"
                        checked={isToggled}
                        onCheckedChange={setIsToggled}
                      />
                      <Label htmlFor="switch">Enable notifications</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cards */}
          <TabsContent value="cards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>A simple card with header and content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is the card content area. You can put any content here.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Card with Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                      Decrease
                    </Button>
                    <Button size="sm" onClick={() => setProgress(Math.min(100, progress + 10))}>
                      Increase
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full" onClick={() => showToast()}>
                      Show Toast
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => showToast('destructive')}>
                      Show Error Toast
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Badge Variants</CardTitle>
                <CardDescription>Different badge styles for various use cases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Standard Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-3">E-commerce Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="inStock">In Stock</Badge>
                    <Badge variant="lowStock">Low Stock</Badge>
                    <Badge variant="outOfStock">Out of Stock</Badge>
                    <Badge variant="sale">Sale</Badge>
                    <Badge variant="featured">Featured</Badge>
                    <Badge variant="category">Category</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Table */}
          <TabsContent value="data" className="space-y-6">
            <DataTable
              columns={columns}
              data={sampleData}
              title="Sample Data Table"
              description="Sortable table with search, filtering, and CSV export"
              searchKey="name"
              searchPlaceholder="Search by name..."
              enableExport={true}
              exportFilename="sample-data.csv"
            />
          </TabsContent>

          {/* Modals & Drawers */}
          <TabsContent value="modals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modals & Drawers</CardTitle>
                <CardDescription>Overlay components for additional content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogDescription>
                          This is a dialog description. You can put form content or other information here.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                          Dialog content goes here. This could be a form, confirmation message, or any other content.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">Open Drawer</Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Drawer Title</SheetTitle>
                        <SheetDescription>
                          This is a drawer that slides in from the side.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                          Drawer content goes here. Great for forms, details, or navigation menus.
                        </p>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Cards */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Orders"
                value="1,234"
                description="Orders this month"
                icon={<ShoppingCart className="h-6 w-6 text-primary" />}
                trend={{ value: 12, label: "from last month", isPositive: true }}
              />
              
              <StatsCard
                title="Revenue"
                value="$45,231"
                description="Revenue this month"
                icon={<DollarSign className="h-6 w-6 text-success" />}
                trend={{ value: 8, label: "from last month", isPositive: true }}
              />
              
              <StatsCard
                title="Products"
                value="567"
                description="Total products"
                icon={<Package className="h-6 w-6 text-accent" />}
              />
              
              <StatsCard
                title="Customers"
                value="2,345"
                description="Active customers"
                icon={<Users className="h-6 w-6 text-secondary-foreground" />}
                trend={{ value: -2, label: "from last month", isPositive: false }}
              />
            </div>
          </TabsContent>

          {/* Feedback States */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmptyState
                icon={<Search className="h-8 w-8 text-muted-foreground" />}
                title="No results found"
                description="Try adjusting your search terms or filters to find what you're looking for."
                action={{ 
                  label: "Clear filters", 
                  onClick: () => showToast('default') 
                }}
              />
              
              <EmptyState
                icon={<Plus className="h-8 w-8 text-muted-foreground" />}
                title="No items yet"
                description="Get started by creating your first item."
                action={{ 
                  label: "Create item", 
                  onClick: () => showToast('default') 
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UIKit;
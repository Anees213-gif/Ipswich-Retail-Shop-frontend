// Admin customers management page
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerStats, setCustomerStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadCustomers();
    loadCustomerStats();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await api.getAdminCustomers({ pageSize: 50 });
      setCustomers(data.customers);
    } catch (error) {
      // Failed to load customers
    } finally {
      setIsLoading(false);
    }
  };

  const loadCustomerStats = async () => {
    try {
      const stats = await api.getCustomerStats();
      setCustomerStats(stats);
    } catch (error) {
      // Failed to load customer stats
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "email",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div>
            <p className="font-medium">{customer.first_name} {customer.last_name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.getValue("phone") || 'N/A'}</span>
        </div>
      ),
    },
    {
      accessorKey: "total_orders",
      header: "Orders",
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue("total_orders")} orders
        </Badge>
      ),
    },
    {
      accessorKey: "total_spent",
      header: "Total Spent",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_spent"));
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, any> = {
          active: 'default',
          vip: 'success',
          inactive: 'secondary'
        };
        return (
          <Badge variant={variants[status] || 'secondary'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "last_order_date",
      header: "Last Order",
      cell: ({ row }) => {
        const date = row.getValue("last_order_date");
        if (!date) return <span className="text-sm text-muted-foreground">No orders</span>;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{format(new Date(date), 'MMM d, yyyy')}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Customer Details - {customer.first_name} {customer.last_name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.email}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {customer.address_line1}
                        {customer.address_line2 && `, ${customer.address_line2}`}
                        {customer.city && `, ${customer.city}`}
                        {customer.state && `, ${customer.state}`}
                        {customer.zip_code && ` ${customer.zip_code}`}
                        {customer.country && `, ${customer.country}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Total Orders</Label>
                      <p className="text-lg font-semibold">{customer.total_orders}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Total Spent</Label>
                      <p className="text-lg font-semibold">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(parseFloat(customer.total_spent))}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                      <Badge variant={customer.status === 'vip' ? 'success' : customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                      <p>{format(new Date(customer.created_at), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Last Order</Label>
                      <p>{customer.last_order_date ? format(new Date(customer.last_order_date), 'MMM d, yyyy') : 'No orders'}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage customer information and relationships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerStats?.totalCustomers || customers.length}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerStats?.activeCustomers || customers.filter(c => c.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Regular shoppers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customerStats?.vipCustomers || customers.filter(c => c.status === 'vip').length}
            </div>
            <p className="text-xs text-muted-foreground">High-value customers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(
                customerStats?.avgOrderValue || 
                (customers.length > 0 ? customers.reduce((sum, c) => sum + parseFloat(c.total_spent), 0) / customers.length : 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchKey="email"
        searchPlaceholder="Search customers..."
        enableExport={true}
        exportFilename="customers.csv"
      />
    </div>
  );
};

export default AdminCustomers;

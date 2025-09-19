// Admin dashboard page
import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { DataTable } from '@/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Order, DashboardStats } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          api.getDashboardStats(),
          api.getOrders({ pageSize: 5 })
        ]);
        
        setStats(statsData);
        setRecentOrders(ordersData.orders);
      } catch (error) {
        // Failed to load dashboard data
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const orderColumns: ColumnDef<Order>[] = [
    {
      accessorKey: "order_number",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("order_number")}</span>
      ),
    },
    {
      accessorKey: "customer_email",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div>
            <p className="font-medium">{order.customer_first_name} {order.customer_last_name}</p>
            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: "Total",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"));
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
          pending: 'secondary',
          confirmed: 'default',
          shipped: 'default',
          delivered: 'success',
          cancelled: 'destructive'
        };
        return (
          <Badge variant={variants[status] || 'secondary'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return format(date, 'MMM d, yyyy');
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p>Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store performance and recent activity
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Orders Today"
          value={stats.ordersToday}
          description="Orders placed today"
          icon={<ShoppingCart className="h-6 w-6 text-primary" />}
          trend={{ value: 12, label: "from yesterday", isPositive: true }}
        />
        
        <StatsCard
          title="Revenue Today"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(stats.revenueToday)}
          description="Revenue generated today"
          icon={<DollarSign className="h-6 w-6 text-success" />}
          trend={{ value: 8, label: "from yesterday", isPositive: true }}
        />
        
        <StatsCard
          title="Avg Order Value"
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(stats.avgOrderValue)}
          description="Average order value"
          icon={<TrendingUp className="h-6 w-6 text-accent" />}
          trend={{ value: 5, label: "from last week", isPositive: true }}
        />
        
        <StatsCard
          title="Error Rate"
          value={`${stats.errorRate}%`}
          description="Order processing errors"
          icon={<AlertCircle className="h-6 w-6 text-destructive" />}
          trend={{ value: -0.2, label: "from last week", isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Orders Last 7 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.ordersLast7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'MMM d')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    formatter={(value) => [value, 'Orders']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.customer_first_name} {order.customer_last_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </p>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'success' : 
                        order.status === 'cancelled' ? 'destructive' : 
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <DataTable
        columns={orderColumns}
        data={recentOrders}
        title="Recent Orders"
        description="Latest orders from your store"
        searchKey="order_number"
        searchPlaceholder="Search orders..."
        enableExport={true}
        exportFilename="recent-orders.csv"
      />
    </div>
  );
};

export default AdminDashboard;
// Admin orders management page
import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import type { Order } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Edit } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await api.getOrders({ pageSize: 50 });
      setOrders(data.orders);
    } catch (error) {
      // Failed to load orders
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrder(orderId, { status } as any);
      loadOrders(); // Refresh data
    } catch (error) {
      // Failed to update order
    }
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "order_number",
      header: "Order ID",
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
        return <Badge variant={status === 'delivered' ? 'success' : status === 'cancelled' ? 'destructive' : 'secondary'}>{status}</Badge>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => format(new Date(row.getValue("created_at")), 'MMM d, yyyy'),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Order {order.order_number}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p><strong>Customer:</strong> {order.customer_first_name} {order.customer_last_name}</p>
                  <p><strong>Email:</strong> {order.customer_email}</p>
                  <p><strong>Phone:</strong> {order.customer_phone || 'N/A'}</p>
                  <p><strong>Total:</strong> ${parseFloat(order.total_amount).toFixed(2)}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <div>
                    <p><strong>Shipping Address:</strong></p>
                    <p>{order.shipping_address_line1}</p>
                    {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                    <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip_code}</p>
                    <p>{order.shipping_country}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Select value={order.status} onValueChange={(value) => updateOrderStatus(order.id.toString(), value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        searchKey="order_number"
        searchPlaceholder="Search orders..."
        enableExport={true}
        exportFilename="orders.csv"
      />
    </div>
  );
};

export default AdminOrders;
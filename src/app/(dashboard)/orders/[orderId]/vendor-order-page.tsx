import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// This would normally come from a database
const getOrderData = (id: string) => {
  return {
    id: id,
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, Anytown, CA 12345",
    },
    date: "May 1, 2025",
    status: "pending",
    total: "$350.00",
    subtotal: "$320.00",
    shipping: "$30.00",
    tax: "$0.00",
    items: [
      {
        id: "1",
        name: "Premium Headphones",
        price: "$120.00",
        quantity: 1,
        image: "/placeholder.svg",
      },
      {
        id: "2",
        name: "Wireless Keyboard",
        price: "$80.00",
        quantity: 1,
        image: "/placeholder.svg",
      },
      {
        id: "3",
        name: "Smart Watch",
        price: "$120.00",
        quantity: 1,
        image: "/placeholder.svg",
      },
    ],
    timeline: [
      {
        date: "May 1, 2025 - 10:30 AM",
        status: "Order Placed",
        description: "Order was placed by customer",
      },
      {
        date: "May 1, 2025 - 11:45 AM",
        status: "Payment Confirmed",
        description: "Payment was confirmed and funds are pending delivery",
      },
    ],
  };
};

export default async function VendorOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = getOrderData(orderId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "in_transit":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-blue-600 border-blue-600"
          >
            <Truck className="h-3 w-3" />
            In Transit
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-green-600 border-green-600"
          >
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Orders</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{orderId}
          </h1>
          <p className="text-muted-foreground">View and manage order details</p>
        </div>
        <div className="ml-auto">{getStatusBadge(order.status)}</div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Products included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>
                History and status updates for this order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative flex h-full w-6 items-center justify-center">
                      <div className="absolute h-full w-px bg-muted-foreground/20" />
                      <div className="relative z-10 h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm text-muted-foreground">
                        {event.date}
                      </p>
                      <h4 className="font-medium">{event.status}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4">
                  <div className="relative flex h-6 w-6 items-center justify-center">
                    <div className="h-2 w-2 rounded-full border border-dashed border-muted-foreground/50" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground italic">
                      Awaiting next update
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Mark as Delivered</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p>{order.customer.phone}</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p>{order.customer.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">{order.subtotal}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Shipping</p>
                <p className="font-medium">{order.shipping}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Tax</p>
                <p className="font-medium">{order.tax}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>{order.total}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

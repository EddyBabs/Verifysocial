import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";

import { fetchUserOrderById } from "@/actions/order";
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
import { currencyFormat } from "@/lib/utils";
import { User as UserType } from "next-auth";
import OrderCustomerSatisfaction from "./order-customer-satisfaction";
import OrderVendorCustomerContact from "./order-vendor-customer-contact";
import { formatDate } from "date-fns";
import { OrderStatus } from "@prisma/client";
import { FcCancel } from "react-icons/fc";

export default async function VendorOrderPage({
  params,
  user,
}: {
  params: Promise<{ orderId: string }>;
  user: UserType & {
    role: "USER" | "ADMIN" | "VENDOR";
    fullname: string;
  };
}) {
  const { orderId } = await params;
  // const order = getOrderData(orderId);
  const order = await fetchUserOrderById(orderId);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
          >
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-blue-600 border-blue-600"
          >
            <Truck className="h-3 w-3" />
            Processing
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-green-600 border-green-600"
          >
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-red-600 border-red-600"
          >
            <FcCancel className="h-3 w-3" />
            Cancelled
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
          <h6>Code: {order.code.value}</h6>
          <p className="text-muted-foreground">View and manage order details</p>
        </div>
        <div className="ml-auto flex gap-2 items-center">
          {getStatusBadge(order.status)}
          <Badge>Payment Status: {order.paymentStatus.toLowerCase()}</Badge>
        </div>
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
                    {/* <TableHead className="w-[80px]">Image</TableHead> */}
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {order.items.map((item) => (
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
                  ))} */}
                  <TableRow>
                    {/* <TableCell>
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </TableCell> */}
                    <TableCell className="font-medium">
                      {order.code.name}
                    </TableCell>
                    <TableCell>{currencyFormat(order.amountValue)}</TableCell>
                    <TableCell>{order.code.quantity}</TableCell>
                    <TableCell className="text-right">
                      {currencyFormat(order.amountValue * order.code.quantity)}
                    </TableCell>
                  </TableRow>
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
                <div className="flex gap-4">
                  <div className="relative flex h-full w-6 items-center justify-center">
                    <div className="absolute h-full w-px bg-muted-foreground/20" />
                    <div className="relative z-10 h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt, "PPP")}
                    </p>
                    <h4 className="font-medium"> Order Placed</h4>
                    <p className="text-sm text-muted-foreground">
                      Order was placed by customer
                    </p>
                  </div>
                </div>
                {order.paymentStatus === "SUCCESS" && (
                  <div className="flex gap-4">
                    <div className="relative flex h-full w-6 items-center justify-center">
                      <div className="absolute h-full w-px bg-muted-foreground/20" />
                      <div className="relative z-10 h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt, "PPP")}
                      </p>
                      <h4 className="font-medium">Payment Confirmed</h4>
                      <p className="text-sm text-muted-foreground">
                        Payment was confirmed and funds are pending delivery
                      </p>
                    </div>
                  </div>
                )}

                {order.status !== "COMPLETED" &&
                  order.status !== "CANCELLED" && (
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
                  )}
              </div>
            </CardContent>
            <CardFooter>
              {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                <Button className="w-full">Mark as Delivered</Button>
              )}

              <OrderVendorCustomerContact orderId={order.id} />

              <OrderCustomerSatisfaction orderId={order.id} user={user} />
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
                  <p className="font-medium">{order?.user?.fullname}</p>
                  {/* <p className="text-sm text-muted-foreground">
                    {order.customer.email}
                  </p> */}
                </div>
              </div>
              {/* <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p>{order.customer.phone}</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p>{order.customer.address}</p>
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">
                  {currencyFormat(order.amountValue * order.code.quantity)}
                </p>
              </div>
              {/* <div className="flex justify-between">
                <p className="text-muted-foreground">Shipping</p>
                <p className="font-medium">{order.shipping}</p>
              </div> */}
              <div className="flex justify-between">
                <p className="text-muted-foreground">Tax</p>
                <p className="font-medium">{currencyFormat(0)}</p>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>{currencyFormat(order.amountValue * order.code.quantity)}</p>
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

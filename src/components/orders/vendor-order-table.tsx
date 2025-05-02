import { CheckCircle2, Clock } from "lucide-react";

import { fetchVendorOrders } from "@/actions/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, currencyFormat } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { formatDate } from "date-fns";
import { SlRefresh } from "react-icons/sl";
import { TiCancel } from "react-icons/ti";

const VendorOrderTable = async () => {
  const orders = await fetchVendorOrders();

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 border-green-600";
      case "CANCELLED":
        return "text-red-600 border-red-600";
      case "PROCESSING":
        return "text-blue-600 border-blue-600";
      default:
        return "text-amber-600 border-amber-600";
    }
  };
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-3 w-3" />;
      case "CANCELLED":
        return <TiCancel className="w-3 h-3" />;
      case "PROCESSING":
        return <SlRefresh className="h-w w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id.slice(7)}</TableCell>
            <TableCell>{order.user?.fullname}</TableCell>
            <TableCell className="hidden md:table-cell">
              {formatDate(order.createdAt, "PPP")}
            </TableCell>
            <TableCell>{currencyFormat(order.amountValue)}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn(
                  "flex w-fit items-center gap-1",
                  getStatusClass(order.status)
                )}
              >
                {getStatusIcon(order.status)}
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">
                Mark as Delivered
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {/* <TableRow>
          <TableCell className="font-medium">#ORD-7245</TableCell>
          <TableCell>John Smith</TableCell>
          <TableCell className="hidden md:table-cell">May 1, 2025</TableCell>
          <TableCell>$350.00</TableCell>
          <TableCell>
            <Badge
              variant="outline"
              className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
            >
              <Clock className="h-3 w-3" />
              Pending
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Mark as Delivered
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">#ORD-7244</TableCell>
          <TableCell>Sarah Johnson</TableCell>
          <TableCell className="hidden md:table-cell">April 30, 2025</TableCell>
          <TableCell>$120.00</TableCell>
          <TableCell>
            <Badge variant="outline" className="flex w-fit items-center gap-1 ">
              <Truck className="h-3 w-3" />
              In Transit
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Update Status
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">#ORD-7242</TableCell>
          <TableCell>Michael Brown</TableCell>
          <TableCell className="hidden md:table-cell">April 25, 2025</TableCell>
          <TableCell>$550.00</TableCell>
          <TableCell>
            <Badge
              variant="outline"
              className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
            >
              <Clock className="h-3 w-3" />
              Pending
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Mark as Delivered
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">#ORD-7241</TableCell>
          <TableCell>Emily Davis</TableCell>
          <TableCell className="hidden md:table-cell">April 22, 2025</TableCell>
          <TableCell>$350.00</TableCell>
          <TableCell>
            <Badge
              variant="outline"
              className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
            >
              <Clock className="h-3 w-3" />
              Pending
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              Mark as Delivered
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">#ORD-7240</TableCell>
          <TableCell>David Wilson</TableCell>
          <TableCell className="hidden md:table-cell">April 20, 2025</TableCell>
          <TableCell>$220.00</TableCell>
          <TableCell>
            <Badge
              variant="outline"
              className="flex w-fit items-center gap-1 text-green-600 border-green-600"
            >
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm">
              View Details
            </Button>
          </TableCell>
        </TableRow> */}
      </TableBody>
    </Table>
  );
};

export default VendorOrderTable;

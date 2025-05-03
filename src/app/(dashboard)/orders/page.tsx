import { fetchUserOrders } from "@/actions/order";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@/lib/auth";
import { currencyFormat } from "@/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";
import { BsEye } from "react-icons/bs";
import VendorOrders from "./vendor-order";

const Page = async () => {
  const session = await auth();
  if (session?.user.role === "VENDOR") return <VendorOrders />;
  return (
    <div className="container">
      <div>
        <h3 className="text-2xl font-semibold">Transaction History</h3>
        <div className="mt-4 w-full overflow-hidden">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};

async function TransactionTable() {
  const orders = await fetchUserOrders();
  return (
    <Table className="w-full">
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Codes</TableHead>
          <TableHead className="w-[200px]">Status</TableHead>
          <TableHead>Delivery Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Created</TableHead>
          <TableHead className="text-right w-[100px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.code.value}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>
              {order.code.deliveryPeriod &&
                formatDate(order.code.deliveryPeriod, "PPP")}
            </TableCell>
            <TableCell className="text-right">
              {currencyFormat(order.amountValue)}
            </TableCell>
            <TableCell className="text-right">
              {formatDate(order.createdAt, "PPP")}
            </TableCell>
            <TableCell className="text-right">
              <Link href={`/orders/${order.id}`} passHref>
                <Button variant={"ghost"}>
                  <BsEye />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Page;

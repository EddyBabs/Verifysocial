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
import { currencyFormat } from "@/lib/utils";
import { formatDate } from "date-fns";
import Link from "next/link";
import React from "react";
import { BsEye } from "react-icons/bs";

const Page = () => {
  return (
    <div className="container">
      <div>
        <h3 className="text-2xl font-semibold">Transaction History</h3>
        <div className="mt-4">
          <TransactionTable />
        </div>
      </div>
    </div>
  );
};

async function TransactionTable() {
  const orders = await fetchUserOrders();
  return (
    <Table>
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Codes</TableHead>
          <TableHead className="w-[200px]">Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right w-[100px]">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.code}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>
              {order.deliveryPeriod && formatDate(order.deliveryPeriod, "PPP")}
            </TableCell>
            <TableCell className="text-right">
              {currencyFormat(order.amountValue)}
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

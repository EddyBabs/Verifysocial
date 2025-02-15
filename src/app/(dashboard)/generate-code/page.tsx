import { vendorGetCodes } from "@/actions/code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "date-fns";
import { BsEye } from "react-icons/bs";
import NewCode from "./new-code";
import { currencyFormat } from "@/lib/utils";

const Page = async () => {
  return (
    <div className="container">
      <div className="space-y-14 ">
        <div className="space-y-4">
          <h3 className="text-4xl font-semibold">
            Verify and track vendors rating for everyone
          </h3>
          <h6 className="text-xl">
            Create, send and start improving your rating from anywhere with
            verify social
          </h6>
        </div>
        <div>
          <div className="flex gap-4 items-center">
            <NewCode />
            <Input className="" placeholder="Enter an existing code" />
          </div>
        </div>
        <hr className="mt-14" />
        <div>
          <h3 className="text-2xl font-semibold">View Latest Codes</h3>
          <div className="mt-4">
            <TableDemo />
          </div>
        </div>
      </div>
    </div>
  );
};

async function TableDemo() {
  const orders = await vendorGetCodes();
  return (
    <Table>
      <TableCaption>A list of your recent codes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Codes</TableHead>
          <TableHead className="w-[200px]">Status</TableHead>
          <TableHead>Delivery Date</TableHead>
          <TableHead className="text-right min-w-[50px]">Min Amount</TableHead>
          <TableHead className="text-right min-w-[50px]">Max Amount</TableHead>
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
              {currencyFormat(order.minAmount)}
            </TableCell>
            <TableCell className="text-right">
              {currencyFormat(order.maxAmount)}
            </TableCell>
            <TableCell className="text-right">
              <Button variant={"ghost"}>
                <BsEye />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {currencyFormat(
              orders.reduce((sum, order) => {
                return sum + Number(order.minAmount);
              }, 0)
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default Page;

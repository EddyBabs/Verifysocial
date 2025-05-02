import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

const VendorOrderOverview = dynamic(
  () => import("@/components/orders/vendor-order-overview")
);
const VendorOrderTable = dynamic(
  () => import("@/components/orders/vendor-order-table")
);

export default function VendorOrders() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track your customer orders
        </p>
      </div>
      <VendorOrderOverview />

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage all your customer orders
          </CardDescription>
          <div className="flex w-full items-center space-x-2 pt-4">
            <Input placeholder="Search orders..." className="max-w-sm" />
            <Button variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <VendorOrderTable />
        </CardContent>
      </Card>
    </div>
  );
}

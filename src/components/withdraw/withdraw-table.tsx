"use client";
import React, { useCallback, useEffect, useState } from "react";

import { ArrowDownIcon, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getWalletHistory } from "@/actions/withdraw";
import { Withdraw } from "@prisma/client";
import { currencyFormat } from "@/lib/utils";
import { formatDate } from "date-fns";

type WithdrawTab = "all" | "pending" | "completed";

const WithdrawTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  //   const tab = (searchParams.get("tab") as WithdrawTab) || undefined;

  const handleTabChange = (type: WithdrawTab | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type) {
      params.set("tab", type);
    } else {
      params.delete("tab");
    }

    router.replace(pathname + "?" + params);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>
          A record of all your withdrawal requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          onValueChange={(value: string) =>
            handleTabChange(value as WithdrawTab)
          }
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Withdrawals</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <RenderTableContent tab="all" />
          <RenderTableContent tab="pending" />
          <RenderTableContent tab="completed" />

          {/* <TabsContent value="pending">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#WD-1245</TableCell>
                  <TableCell className="text-red-600">
                    <div className="flex items-center gap-1">
                      <ArrowDownIcon className="h-4 w-4" />
                      $500.00
                    </div>
                  </TableCell>
                  <TableCell>Bank Transfer</TableCell>
                  <TableCell className="hidden md:table-cell">
                    May 2, 2025
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="flex w-fit items-center gap-1 text-amber-600 border-amber-600"
                    >
                      <Clock className="h-3 w-3" />
                      Processing
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/withdrawals/1245">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="completed">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#WD-1244</TableCell>
                  <TableCell className="text-red-600">
                    <div className="flex items-center gap-1">
                      <ArrowDownIcon className="h-4 w-4" />
                      $780.00
                    </div>
                  </TableCell>
                  <TableCell>Bank Transfer</TableCell>
                  <TableCell className="hidden md:table-cell">
                    April 28, 2025
                  </TableCell>
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
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/withdrawals/1244">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#WD-1243</TableCell>
                  <TableCell className="text-red-600">
                    <div className="flex items-center gap-1">
                      <ArrowDownIcon className="h-4 w-4" />
                      $1,200.00
                    </div>
                  </TableCell>
                  <TableCell>Bank Transfer</TableCell>
                  <TableCell className="hidden md:table-cell">
                    April 15, 2025
                  </TableCell>
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
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/withdrawals/1243">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#WD-1242</TableCell>
                  <TableCell className="text-red-600">
                    <div className="flex items-center gap-1">
                      <ArrowDownIcon className="h-4 w-4" />
                      $950.00
                    </div>
                  </TableCell>
                  <TableCell>Bank Transfer</TableCell>
                  <TableCell className="hidden md:table-cell">
                    April 2, 2025
                  </TableCell>
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
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/withdrawals/1242">View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent> */}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const RenderTableContent = ({ tab }: { tab: WithdrawTab }) => {
  const [withdraws, setWithdraws] = useState<Withdraw[]>([]);
  const fetchWithdrawTable = useCallback(async () => {
    const withdraws = await getWalletHistory(tab);
    setWithdraws(withdraws);
  }, [tab]);

  useEffect(() => {
    fetchWithdrawTable();
  }, [fetchWithdrawTable]);
  return (
    <TabsContent value={tab} className="overflow-hidden w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdraws.map((withdraw) => (
            <TableRow key={withdraw.id}>
              <TableCell className="font-medium">
                #{withdraw.id.slice(0, 4)}
              </TableCell>
              <TableCell className="text-red-600">
                <div className="flex items-center gap-1">
                  <ArrowDownIcon className="h-4 w-4" />
                  {currencyFormat(withdraw.amount)}
                </div>
              </TableCell>
              <TableCell>Bank Transfer</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(withdraw.createdAt, "PPP")}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    "flex w-fit items-center gap-1 text-amber-600 border-amber-600"
                  }
                >
                  {withdraw.status === "PROCESSING" ? (
                    <Clock className="h-3 w-3" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                  {`${withdraw.status.charAt(0).toUpperCase()}${withdraw.status
                    .slice(1)
                    .toLowerCase()}`}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/wallet/${withdraw.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TabsContent>
  );
};

export default WithdrawTable;

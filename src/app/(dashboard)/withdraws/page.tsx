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
import { currencyFormat } from "@/lib/utils";

export default function WithdrawalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Withdrawals</h1>
        <p className="text-muted-foreground">
          Manage and track your withdrawal requests
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
            <CardDescription>Funds available for withdrawal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currencyFormat(3300.0)}</div>
            <Link href="/wallet">
              <Button className="w-full mt-4">Withdraw Funds</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Withdrawals</CardTitle>
            <CardDescription>Funds being processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currencyFormat(500.0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Expected completion: May 5, 2025
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Withdrawn</CardTitle>
            <CardDescription>Lifetime withdrawals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{currencyFormat(12450.0)}</div>
            {/* <Button variant="outline" className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" />
              Download Statement
            </Button> */}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
          <CardDescription>
            A record of all your withdrawal requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Withdrawals</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
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
            </TabsContent>
            <TabsContent value="pending">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

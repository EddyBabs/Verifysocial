import {
  ArrowDownIcon,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { getWithdraw } from "@/actions/withdraw";
import { notFound } from "next/navigation";
import { addMinutes, formatDate } from "date-fns";
import { currencyFormat } from "@/lib/utils";

export default async function WithdrawalDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // This would normally fetch the withdrawal details based on the ID
  const withdrawalId = (await params).id;

  const withdrawal = await getWithdraw(withdrawalId);
  if (!withdrawal) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/wallet">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Withdrawal Details
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Information</CardTitle>
            <CardDescription>
              Details about this withdrawal request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Reference ID
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{withdrawal.reference}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <div className="flex items-center gap-1 text-red-600 font-medium">
                <ArrowDownIcon className="h-4 w-4" />
                {currencyFormat(withdrawal.amount)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fee</span>
              <span className="font-medium">
                {currencyFormat(withdrawal.fee)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-medium">
                {currencyFormat(withdrawal.amount - withdrawal.fee)}
              </span>
            </div>
            <Separator />
            {/* <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Payment Method
              </span>
              <span className="font-medium">{withdrawal.method}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Account Name
              </span>
              <span className="font-medium">{withdrawal.accountName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Account Number
              </span>
              <span className="font-medium">{withdrawal.accountNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bank Name</span>
              <span className="font-medium">{withdrawal.bankName}</span>
            </div>
            <Separator /> */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Request Date
              </span>
              <span className="font-medium">
                {formatDate(withdrawal.createdAt, "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Completion Date
              </span>
              <span className="font-medium">
                {withdrawal.completedAt
                  ? formatDate(withdrawal.completedAt, "dd/MM/yyyy")
                  : "NIL"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              {withdrawal.status === "PROCESSING" ? (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-amber-600 border-amber-600"
                >
                  <Clock className="h-3 w-3" />
                  Processing
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-green-600 border-green-600"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Timeline</CardTitle>
            <CardDescription>
              Track the progress of your withdrawal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-muted">
              <li className="mb-6 ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-background">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                </span>
                <h3 className="flex items-center mb-1 text-sm font-semibold">
                  Withdrawal Requested
                </h3>
                <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                  {formatDate(withdrawal.createdAt, "dd/MM/yyyy")}
                </time>
                <p className="text-sm">
                  Your withdrawal request has been received and is being
                  processed.
                </p>
              </li>

              {withdrawal.status === "PROCESSING" ? (
                <>
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full -left-3 ring-8 ring-background">
                      <Clock className="w-3 h-3 text-amber-600" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold">
                      Processing
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                        Current
                      </span>
                    </h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                      Started {formatDate(withdrawal.createdAt, "dd/MM/yyyy")}
                    </time>
                    <p className="text-sm">
                      Your withdrawal is being processed by our finance team.
                    </p>
                  </li>
                  <li className="ml-6 opacity-50">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full -left-3 ring-8 ring-background">
                      <CheckCircle2 className="w-3 h-3 text-gray-500" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold">
                      Funds Transferred
                    </h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                      Expected{" "}
                      {formatDate(
                        addMinutes(withdrawal.createdAt, 30),
                        "dd/MM/yyyy HH:mm:ss"
                      )}
                      {/* {withdrawal.completionDate} */}
                    </time>
                    <p className="text-sm">
                      Funds will be transferred to your bank account.
                    </p>
                  </li>
                </>
              ) : (
                <>
                  <li className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-background">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold">
                      Processing
                    </h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                      Started{" "}
                      {formatDate(withdrawal.createdAt, "dd/MM/yyyy HH:mm:ss")}
                    </time>
                    <p className="text-sm">
                      Your withdrawal was processed by our finance team.
                    </p>
                  </li>
                  <li className="ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-100 rounded-full -left-3 ring-8 ring-background">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    </span>
                    <h3 className="flex items-center mb-1 text-sm font-semibold">
                      Funds Transferred
                      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                        Completed
                      </span>
                    </h3>
                    <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">
                      {withdrawal.completedAt
                        ? formatDate(withdrawal.completedAt, "dd/MM/yyyy")
                        : "NIL"}
                    </time>
                    <p className="text-sm">
                      Funds have been successfully transferred to your bank
                      account.
                    </p>
                  </li>
                </>
              )}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

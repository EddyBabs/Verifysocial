"use client";

import { CheckCircle2, Clock, QrCode, User, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Prisma } from "@prisma/client";
import { formatDate } from "date-fns";

interface CodeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  code: Prisma.CodeGetPayload<{ include: { order: { select: { id: true } } } }>;
}

export function CodeDetailsModal({
  isOpen,
  onClose,
  code,
}: CodeDetailsModalProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-green-600 border-green-600"
          >
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        );
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
      case "redeemed":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-green-600 border-green-600"
          >
            <CheckCircle2 className="h-3 w-3" />
            Redeemed
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 text-red-600 border-red-600"
          >
            <X className="h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Code Details</DialogTitle>
          <DialogDescription>
            Verification code information and status
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-lg border p-4 text-center">
            <div className="mb-2 flex items-center justify-center">
              <QrCode className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Verification Code</h3>
            </div>
            <p className="text-2xl font-bold tracking-wider">{code.value}</p>
            <div className="mt-2 flex justify-center">
              {getStatusBadge(code.status)}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                {/* <p className="font-medium">{code.customer}</p>
                {code.email && (
                  <p className="text-sm text-muted-foreground">{code.email}</p>
                )} */}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Generated</p>
                <p className="font-medium">
                  {formatDate(code.createdAt, "PPP")}
                </p>
              </div>
              {/* <div>
                <p className="text-sm text-muted-foreground">Expires</p>
                <p className="font-medium">{code.expires}</p>
              </div> */}
            </div>

            {code.order?.id && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Order Reference
                  </p>
                  <p className="font-medium">#{code.order.id}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Send to Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

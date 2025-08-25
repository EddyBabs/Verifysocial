"use client";

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
import { Prisma } from "@prisma/client";
import { formatDate } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { BsEye } from "react-icons/bs";
import { CodeDetailsModal } from "./code-details-modal";

type selectedOrderType = Prisma.CodeGetPayload<{
  include: { order: { select: { id: true } } };
}>;

function CodeTable({
  codes,
}: {
  codes: Prisma.CodeGetPayload<{
    include: { order: { select: { id: true } } };
  }>[];
}) {
  const [selectedCode, setSelectedCode] = useState<selectedOrderType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewCode = (code: selectedOrderType) => {
    setSelectedCode(code);
    setIsModalOpen(true);
  };
  return (
    <>
      <Table>
        <TableCaption>A list of your recent codes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Codes</TableHead>
            <TableHead className="w-[200px]">Status</TableHead>
            <TableHead className="min-w-[150px]">Delivery Date</TableHead>
            <TableHead className="text-left min-w-[100px]">Amount</TableHead>

            <TableHead className="text-right w-[100px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {codes.map((code) => (
            <TableRow key={code.id}>
              <TableCell className="font-medium">{code.value}</TableCell>
              <TableCell>{code.status}</TableCell>
              <TableCell>
                {code.deliveryPeriod && formatDate(code.deliveryPeriod, "PPP")}
              </TableCell>
              <TableCell className="text-left">
                {currencyFormat(code.amountValue)}
              </TableCell>
              <TableCell className="text-right flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewCode(code)}
                >
                  View
                </Button>
                {code.order?.id && (
                  <Link href={`/orders/${code.order.id}`}>
                    <Button variant={"ghost"}>
                      <BsEye />
                    </Button>
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedCode && (
        <CodeDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          code={selectedCode}
        />
      )}
    </>
  );
}

export default CodeTable;

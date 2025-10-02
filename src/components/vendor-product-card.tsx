"use client";
import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { toast } from "@/hooks/use-toast";
import { deleteVendorProduct } from "@/actions/product";
import { useRouter } from "next/navigation";

const VendorProductCard = ({
  product,
}: {
  product: {
    image: string;
    name: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    vendorId: string;
  };
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <div className="relative">
      <div className="absolute top-1 right-1 ">
        <Button
          variant={"secondary"}
          className="rounded-full text-destructive w-8 h-8"
          onClick={() =>
            startTransition(async () => {
              await deleteVendorProduct(product.id)
                .then(() => {
                  router.refresh();
                })
                .catch((error) => {
                  const errorMessage =
                    error?.error || "Unable to delete product";
                  toast({
                    title: "An error occured",
                    description: errorMessage,
                    variant: "destructive",
                  });
                });
            })
          }
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Trash2Icon />}
        </Button>
      </div>
      <Card>
        <Image
          src={product.image}
          width={250}
          height={250}
          alt=""
          className="aspect-video object-contain w-full h-full max-h-64"
        />
        {product.name && (
          <CardContent className="pt-8">
            <h2 className="text-lg font-medium">{product.name}</h2>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default VendorProductCard;

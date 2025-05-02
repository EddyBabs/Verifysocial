"use client";
import { getSearchedVendors } from "@/actions/vendor";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import React, {
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import VendorAvatar from "./vendor-avatar";

type VendorDetailsType = Prisma.VendorGetPayload<{
  select: {
    id: true;
    businessName: true;
    rating: true;
    reviewCount: true;
    User: {
      select: {
        image: true;
        address: { select: { country: true; state: true } };
      };
    };
  };
}>;

const VendorSearchInput: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [vendors, setVendors] = useState<VendorDetailsType[]>([]);
  const [focus, setFocus] = useState(false);
  const [order, setOrder] = useState<
    Prisma.CodeGetPayload<{
      include: {
        vendor: {
          select: {
            businessAbout: true;
            rating: true;
            reviewCount: true;
            businessName: true;
            tier: true;
            User: { select: { image: true; address: true } };
          };
        };
      };
    }>
  >();
  const [isPending, startTransition] = useTransition();
  const [searchVendor, setSearchvendor] = useState("");
  const handleSearch = (value: string) => {
    startTransition(async () => {
      setOrder(undefined);
      setVendors([]);
      await getSearchedVendors(value).then((response) => {
        if (response.code) {
          setOrder(response.code);
        } else {
          setVendors(response.vendors);
        }
      });
    });
  };
  const debouncedSearch = useDebounce(handleSearch, 1000);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchvendor(event.target.value);
    debouncedSearch(event.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setFocus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <Input
        className={cn(className)}
        onChange={handleInputChange}
        onFocus={() => setFocus(true)}
        {...props}
      />

      {focus && searchVendor && (
        <Card className={cn("absolute left-0 w-full transition-all z-20")}>
          <CardContent className="pt-4">
            {isPending ? (
              <div className="min-h-[100px] w-full h-full flex items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : order ? (
              <div className="">
                <Link
                  href={`/vendor/${order.vendorId}?vendorcode=${order.value}`}
                >
                  <div>
                    <VendorAvatar vendor={order.vendor} />
                  </div>
                </Link>
              </div>
            ) : !vendors.length ? (
              <div className="min-h-[100px] w-full h-full flex items-center justify-center">
                <p>Could not find vendor with specified search</p>
              </div>
            ) : (
              vendors.map((vendor) => (
                <div key={vendor.id}>
                  <Link href={`/vendor/${vendor.id}`}>
                    <div>
                      <VendorAvatar vendor={vendor} />
                    </div>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default VendorSearchInput;

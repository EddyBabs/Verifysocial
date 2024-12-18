"use client";
import { getSearchedVendors } from "@/actions/vendor";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Prisma, Vendor } from "@prisma/client";
import { Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import VendorAvatar from "./vendor-avatar";

const SearchVendors = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [focus, setFocus] = useState(false);
  const [order, setOrder] = useState<
    Prisma.OrderGetPayload<{
      include: {
        vendor: {
          select: { buisnessAbout: true; buisnessName: true; tier: true };
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
        if (response.order) {
          setOrder(response.order);
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
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute w-6 h-6 top-1/2 left-2 -translate-y-3" />
        <Input
          placeholder="Search by name"
          className="pl-10"
          onChange={handleInputChange}
          onFocus={() => setFocus(true)}
          //   onBlur={() => setFocus(false)}
        />
      </div>
      {focus && searchVendor && (
        <Card className={cn("absolute left-0 w-full transition-all")}>
          <CardContent className="pt-4">
            {isPending ? (
              <div className="min-h-[100px] w-full h-full flex items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : order ? (
              <div className="">
                <Link
                  href={`/dashboard/vendor/${order?.vendorId}?vendorcode=${order?.code}`}
                >
                  <div>
                    <VendorAvatar vendor={order?.vendor} />
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
                  <Link href={`/dashboard/vendor/${vendor.id}`}>
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
    </div>
  );
};

export default SearchVendors;

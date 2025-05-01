import { getPaginatedVendors } from "@/actions/vendor";
import SearchVendors from "@/components/search-vendors";
import VendorAvatar from "@/components/vendor-avatar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import noImagePlacehoder from "@/assets/images/no-image-placehoder.webp";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const category = (await searchParams)?.category;
  const vendors = await getPaginatedVendors(category);
  return (
    <div>
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-4xl font-bold">Vendors</h1>
        </div>
        <SearchVendors />
      </div>

      {!vendors.length ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div>
            <h1 className="text-2xl font-semibold text-center">
              Could not find any vendor on speficied category
            </h1>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {vendors.map((vendor, index) => (
            <Link href={`/vendor/${vendor.id}`} key={index}>
              <div className="group cursor-pointer border rounded-xl shadow">
                <div className="mb-4 overflow-hidden">
                  <Image
                    src={vendor.Product?.[0]?.image || noImagePlacehoder}
                    alt=""
                    width={300}
                    height={300}
                    className="group-hover:scale-105 transition-all rounded-xl object-cover w-full h-full aspect-video overflow-hidden"
                  />
                </div>
                <div className="p-2">
                  <VendorAvatar vendor={vendor} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;

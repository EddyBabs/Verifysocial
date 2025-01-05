import { Search } from "lucide-react";
import VendorSearchInput from "./vendor-search-input";

const SearchVendors = () => {
  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute w-6 h-6 top-1/2 left-2 -translate-y-3" />
        <VendorSearchInput className="pl-10" placeholder="Search by name" />
      </div>
    </div>
  );
};

export default SearchVendors;

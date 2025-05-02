import { vendorGetCodes } from "@/actions/code";
import CodeTable from "@/components/code/code-table";
import { Input } from "@/components/ui/input";
import NewCode from "./new-code";

const Page = async () => {
  const codes = await vendorGetCodes();
  return (
    <div className="container">
      <div className="space-y-14 ">
        <div className="space-y-4">
          <h3 className="text-4xl font-semibold">
            Verify and track vendors rating for everyone
          </h3>
          <h6 className="text-xl">
            Create, send and start improving your rating from anywhere with
            verify social
          </h6>
        </div>
        <div>
          <div className="flex gap-4 items-center">
            <NewCode />
            <Input className="" placeholder="Enter an existing code" />
          </div>
        </div>
        <hr className="mt-14" />
        <div>
          <h3 className="text-2xl font-semibold">View Latest Codes</h3>
          <div className="mt-4">
            <CodeTable codes={codes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

import { getCurrentVendorReviews } from "@/actions/vendor";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Ratings from "@/components/ui/ratings";
import { getCurrentUserDetails } from "@/data/user";
import { Prisma } from "@prisma/client";
import { formatDate } from "date-fns";
import Link from "next/link";

const Page = async () => {
  const { user } = await getCurrentUserDetails();
  const { reviews } = await getCurrentVendorReviews();
  return (
    <div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h4 className="text-xl font-semibold">Reviews & Ratings</h4>
          <Link href="/generate-code">
            <Button>Generate Code</Button>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <h1 className="font-extrabold text-6xl">
            {Math.max(Number(user.vendor?.rating?.toFixed()) || 0, 0)}
          </h1>
          <div className="space-y-4 w-full sm:w-2/6">
            <Progress value={(user?.vendor?.rating || 0) >= 5 ? 100 : 0} />
            <Progress value={(user?.vendor?.rating || 0) >= 4 ? 100 : 0} />
            <Progress value={(user?.vendor?.rating || 0) >= 3 ? 100 : 0} />
            <Progress value={(user?.vendor?.rating || 0) >= 2 ? 100 : 0} />
            <Progress value={(user?.vendor?.rating || 0) >= 1 ? 100 : 0} />
          </div>
        </div>
      </div>

      {!reviews.length ? (
        <div className="min-h-96 flex justify-center items-center text-center">
          <h3 className="text-xl font-semibold">
            You currently do not have any reviews at the moment.
          </h3>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-semibold">What Customers Saying</h3>
          <div>
            {reviews.map((review) => (
              <VendorReviewVertical review={review} key={review.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const VendorReviewVertical = ({
  review,
}: {
  review: Prisma.ReviewGetPayload<{
    include: { user: { select: { fullname: true } } };
  }>;
}) => {
  return (
    <div className="space-y-2 border-b-2 py-4">
      <h4>{review.user.fullname}</h4>
      <p>{formatDate(review.createdAt, "PPP")}</p>
      <Ratings variant="yellow" value={review.rating} />
      <p>{review.comment}</p>
    </div>
  );
};

export default Page;

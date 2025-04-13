import ReviewCard from "@/components/reveiw-card";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { FeaturePrisma } from "@/types";

const VendorReviews = ({
  reviews,
  page,
  totalCount,
  size,
}: {
  reviews: FeaturePrisma[];
  page: number;
  totalCount: number;
  size: number;
}) => {
  return (
    <Card className="col-span-2">
      <CardContent className="p-4">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Reviews</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

        <div className="mt-10 mb-4 text-left">
          <PaginationWithLinks
            page={page}
            pageSize={size}
            totalCount={totalCount}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorReviews;

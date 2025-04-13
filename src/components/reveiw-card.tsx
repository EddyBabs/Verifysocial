import { FeaturePrisma } from "@/types";
import { format } from "date-fns";
import Ratings from "./ui/ratings";

const ReviewCard = ({ review }: { review: FeaturePrisma }) => {
  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg">
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-semibold">{review.user.fullname}</h2>
          <p>{format(review.createdAt, "PPP")}</p>
        </div>
        <div className="fill-[#FFDD55]">
          <Ratings value={review.rating} variant="yellow" />
        </div>
        <div>{review.comment}</div>
      </div>
    </div>
  );
};

export default ReviewCard;

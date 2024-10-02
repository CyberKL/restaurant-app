import { UIReview } from "@/types/review";
import { Rating } from "react-simple-star-rating";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import ReviewDialog from "./ReviewDialog";
import { useParams } from "react-router-dom";
import { updateUserReview } from "@/api/api";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { deleteReview } from "@/features/reviews/reviewsSlice";
import { useTranslation } from "react-i18next";

interface ReviewProps extends UIReview {
  userID?: number;
}

export default function Review(props: ReviewProps) {
  const params = useParams();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const handleDelete = async () => {
    const response = await updateUserReview(
      Number(params.id),
      props.reveiwID,
      true
    );
    if (response && response.ok) {
      dispatch(deleteReview(props.reveiwID));
      toast({
        title: t("review.success"),
      });
    } else {
      toast({
        title: t("review.fail.title"),
        description: t("review.fail.description"),
      });
    }
  };
  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between">
        <div className="">
          <h1 className="font-semibold text-lg" aria-label="Review Title">
            {props.name}
          </h1>
          <Rating
            readonly
            initialValue={props.rating} // Display the initial value
            SVGclassName="inline-block"
            size={20}
            fillColor="#16a34a"
            aria-label={`Rating: ${props.rating}`} // Accessibility label for the rating
          />
        </div>
        {props.userID ? ( // Check if userID is present to render edit and delete options
          <div>
            {/* Review dialog for editing the review */}
            <ReviewDialog
              itemID={Number(params.id)}
              mode="edit"
              reviewID={props.reveiwID}
              rating={props.rating}
              comment={props.comment}
            />
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={handleDelete}
              aria-label="Delete Review" // Accessibility label for the delete button
            >
              <Trash color="#dc2626" /> {/* Icon for deleting the review */}
            </Button>
          </div>
        ) : null}
      </div>
      {props.comment && <div>{props.comment}</div>} {/* Display the review comment if present */}
    </div>
  );
}

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

interface ReviewProps extends UIReview {
  userID?: number;
}

export default function Review(props: ReviewProps) {
  const params = useParams()
  const dispatch = useDispatch()
    const handleDelete = async () => {
        const response = await updateUserReview(Number(params.id), props.reveiwID, true)
        if (response && response.ok)
        {
          dispatch(deleteReview(props.reveiwID));
            toast({
                title: "Review deleted"
            })
        }
        else{
            toast({
                title: "Review not deleted",
                description: "Error while deleting review, please try again"
            })
        }
    }
  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between">
        <div className="">
          <h1 className="font-semibold text-lg">{props.name}</h1>
          <Rating
            readonly
            initialValue={props.rating}
            SVGclassName="inline-block"
            size={20}
            fillColor="#16a34a"
          />
        </div>
        {props.userID ? (
            <div>
                <ReviewDialog itemID={Number(params.id)} mode="edit" reviewID={props.reveiwID} rating={props.rating} comment={props.comment} />
                <Button variant={"ghost"} size={"icon"} onClick={handleDelete}>
                    <Trash color="#dc2626" /> 
                </Button>
            </div>
        ) : null}
      </div>
      {props.comment && <div>{props.comment}</div>}
    </div>
  );
}

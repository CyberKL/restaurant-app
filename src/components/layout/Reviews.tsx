import { fetchOtherUsersReviews, fetchUserReviews } from "@/api/api";
import { UIReview, DBReview } from "@/types/review";
import { useEffect, useState } from "react";
import Review from "../common/Review";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setReviews as setUserReviews } from "@/features/reviews/reviewsSlice";

interface ReviewsProps {
  foodItemID: number;
}
export default function Reviews(props: ReviewsProps) {
  const [reviews, setReviews] = useState<UIReview[]>([]);
  const userReviews: DBReview[] = useSelector(
    (state: RootState) => state.reviews
  );

  const dispatch = useDispatch();

  // Get other users reviews for the item
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchOtherUsersReviews(props.foodItemID);
      if (response) {
        setReviews(response.reverse());
      }
    };

    fetchData();
  }, []);

  // Get user reviews for the item
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUserReviews(props.foodItemID);
      if (response) {
        dispatch(setUserReviews(response));
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {userReviews.length === 0 && reviews.length === 0 ? (
        <div className="flex justify-center items-center h-[100px]">
          There is no reviews yet, be the first one!
        </div>
      ) : (
        <ScrollArea className="h-[200px] p-4">
          <div className="divide-y-2">
            {userReviews.length === 0
              ? null
              : userReviews.map((item, index) => (
                  <Review {...item} key={index} />
                ))}
            {reviews.length === 0
              ? null
              : reviews.map((item, index) => <Review {...item} key={index} />)}
          </div>
        </ScrollArea>
      )}
    </>
  );
}

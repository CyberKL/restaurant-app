import { fetchOtherUsersReviews, fetchUserReviews } from "@/api/api";
import { UIReview, DBReview } from "@/types/review";
import { useEffect, useState } from "react";
import Review from "../common/Review";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { setReviews as setUserReviews } from "@/features/reviews/reviewsSlice";
import { useTranslation } from "react-i18next";

interface ReviewsProps {
  foodItemID: number;
}
export default function Reviews(props: ReviewsProps) {
  const [reviews, setReviews] = useState<UIReview[]>([]);
  const userReviews: DBReview[] = useSelector(
    (state: RootState) => state.reviews
  );
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const dispatch = useDispatch();
  const [t] = useTranslation();

  // Get other users reviews for the item
  useEffect(() => {
    console.log(props.foodItemID)
    const fetchData = async () => {
      const response = await fetchOtherUsersReviews(props.foodItemID);
      if (response) {
        setReviews(response.reverse());
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Get user reviews for the item
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        const response = await fetchUserReviews(props.foodItemID);
        if (response) {
          dispatch(setUserReviews(response));
          return
        }
      }
      dispatch(setUserReviews([]))
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <>
      {userReviews.length === 0 && reviews.length === 0 ? (
        <div className="flex justify-center items-center h-[100px]" aria-live="polite" role="status">
          {t('reviews.empty')}
        </div>
      ) : (
        <ScrollArea className="h-[320px] p-4" aria-label="Reviews list">
          <div className="divide-y-2">
            {userReviews.length !== 0 &&
              userReviews.map((item, index) => (
                <Review {...item} key={index} aria-labelledby={`user-review-${index}`} />
              ))}
            {reviews.length !== 0 &&
              reviews.map((item, index) => (
                <Review {...item} key={index} aria-labelledby={`review-${index}`} />
              ))}
          </div>
        </ScrollArea>
      )}
    </>
  );
  
}

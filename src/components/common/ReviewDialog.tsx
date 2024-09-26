import { RootState } from "@/app/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReviewFormSchema, reviewSchema } from "@/validations/reviewSchema";
import { Rating } from "react-simple-star-rating";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { addReview, updateUserReview } from "@/api/api";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import { useState } from "react";
import { addReview as addUserReview, editReview } from "@/features/reviews/reviewsSlice";
import { DBReview } from "@/types/review";

interface ReviewDialogProps {
  itemID: number;
  mode: string;
  reviewID?: string;
  rating?: number;
  comment?: string;
}

export default function ReviewDialog(props: ReviewDialogProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // Form handling

  const form = useForm<ReviewFormSchema>({
    resolver: yupResolver(reviewSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ReviewFormSchema) => {
    let response;
    let newReview;
    if (props.mode === "add")
    {
        const result = await addReview(data, props.itemID); // API call
        response = result?.response
        newReview = result?.newReview 
    }
    else if (props.mode === "edit" && props.reviewID)
    {
        response = await updateUserReview(props.itemID, props.reviewID, false, data)
    }

    if (response && response.ok) {
      if (props.mode === "add")
      {
        dispatch(addUserReview(newReview as DBReview)) // Type assertion as response is already ok
      }
      else if (props.mode === "edit")
      {
        dispatch(editReview({
          reviewID: props.reviewID as string,
          rating: data.rating as number,
          comment: data.comment,
        }))
      }
      toast({
        title: "Review submitted!",
      });
      form.reset({ comment: "", rating: 0 });
    } else {
      toast({
        title: "An error occurred while submitting your reveiw",
      });
    }
    setOpen(false)
  };
  // Check if user is logged in before adding a review
  const checkAuthentication = () => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.mode === "add" ? (
          <Button className="w-full" onClick={checkAuthentication}>
            Add Review
          </Button>
        ) : props.mode === "edit" ? (
          <Button variant={"ghost"} size={"icon"}>
            <Edit color="#16a34a" />
          </Button>
        ) : null}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.mode === "add" ? 'Add' : 'Edit'} Review</DialogTitle>
          <DialogDescription>
            Rate your experience with this dish and leave a short review.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div>
                        <Input className="hidden" />{" "}
                        {/* Hidden input used to maintain consistent spacing and layout as rating has undefined positioning, this component offers no functionality */}
                        <Rating
                          onClick={(value) => field.onChange(value)}
                          SVGclassName="inline-block"
                          size={25}
                          fillColor="#16a34a"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

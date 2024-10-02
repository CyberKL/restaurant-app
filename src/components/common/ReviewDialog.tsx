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
import { createReviewSchema, ReviewFormSchema } from "@/validations/reviewSchema";
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
import {
  addReview as addUserReview,
  editReview,
} from "@/features/reviews/reviewsSlice";
import { DBReview } from "@/types/review";
import { useTranslation } from "react-i18next";

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
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation();

  // Form handling

  const reviewSchema = createReviewSchema(t);

  const form = useForm<ReviewFormSchema>({
    resolver: yupResolver(reviewSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ReviewFormSchema) => {
    let response;
    let newReview;
    if (props.mode === "add") {
      const result = await addReview(data, props.itemID); // API call
      response = result?.response;
      newReview = result?.newReview;
    } else if (props.mode === "edit" && props.reviewID) {
      response = await updateUserReview(
        props.itemID,
        props.reviewID,
        false,
        data
      );
    }

    if (response && response.ok) {
      if (props.mode === "add") {
        dispatch(addUserReview(newReview as DBReview)); // Type assertion as response is already ok
      } else if (props.mode === "edit") {
        dispatch(
          editReview({
            reviewID: props.reviewID as string,
            rating: data.rating as number,
            comment: data.comment,
          })
        );
      }
      toast({
        title: t('reviewDialog.success'),
      });
      form.reset({ comment: "", rating: 0 });
    } else {
      toast({
        title: t('reviewDialog.fail'),
      });
    }
    setOpen(false);
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
          <Button className="w-full" onClick={checkAuthentication} aria-label="Add Review">
            {t("reviewDialog.trigger")}
          </Button>
        ) : props.mode === "edit" ? (
          <Button variant={"ghost"} size={"icon"} aria-label="Edit Review">
            <Edit color="#16a34a" />
          </Button>
        ) : null}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {props.mode === "add" ? t("reviewDialog.actions.add") : t("reviewDialog.actions.edit")} {t("reviewDialog.title")}
          </DialogTitle>
          <DialogDescription>{t("reviewDialog.description")}</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("reviewDialog.rating")}</FormLabel>
                    <FormControl>
                      <div>
                        <Input className="hidden" aria-hidden="true" />{" "}
                        {/* Hidden input used to maintain consistent spacing and layout as rating has undefined positioning, this component offers no functionality */}
                        <Rating
                          onClick={(value) => field.onChange(value)}
                          SVGclassName="inline-block"
                          size={25}
                          fillColor="#16a34a"
                          rtl={i18n.language === 'ar'}
                          allowFraction
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
                    <FormLabel>{t("reviewDialog.comment")}</FormLabel>
                    <FormControl>
                      <Textarea {...field} aria-label="Review Comment" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" aria-label="Submit Review">
                {t("reviewDialog.submit")}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

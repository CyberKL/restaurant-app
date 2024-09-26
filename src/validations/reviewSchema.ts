import * as yup from "yup";

export const reviewSchema = yup.object().shape({
    rating: yup.number().min(1, "Rating is required").max(5).required("Rating is required"),
    comment: yup.string().max(200)
});

export type ReviewFormSchema = yup.InferType<typeof reviewSchema>;
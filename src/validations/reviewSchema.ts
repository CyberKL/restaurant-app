import * as yup from "yup";
import { TFunction } from "i18next";

// Create a function that takes `t` as an argument
export const createReviewSchema = (t: TFunction) =>
  yup.object().shape({
    rating: yup
      .number()
      .min(1, t('reviewDialog.validation'))
      .required(t('reviewDialog.validation')),
    comment: yup.string().max(200),
  });

export type ReviewFormSchema = yup.InferType<ReturnType<typeof createReviewSchema>>;

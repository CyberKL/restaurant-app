import { DBReview } from "@/types/review";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface EditPayload {
    reviewID: string;
    rating: number;
    comment?: string;
}

const initialState: DBReview[] = []

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {
        setReviews: (_, action) => action.payload,
        addReview: (state, action: PayloadAction<DBReview>) => {state.push(action.payload)},
        editReview: (state, action: PayloadAction<EditPayload>) => {
            const review = state.find((item) => item.reveiwID === action.payload.reviewID)
            if(review)
            {
                review.rating = action.payload.rating
                review.comment = action.payload.comment
                state.forEach((item) => item.reveiwID === action.payload.reviewID ? item = review : null)
            }
        },
        deleteReview: (state, action: PayloadAction<string>) => {state = state.filter((item) => item.reveiwID !== action.payload); return state}
    },
})

export const {setReviews, addReview, editReview, deleteReview} = reviewSlice.actions
export default reviewSlice.reducer
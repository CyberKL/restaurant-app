interface UIReview {
    reveiwID: string
    name: string;
    rating: number;
    comment?: string;
  }
  interface DBReview extends UIReview {
    userID: number;
  }
  
  export type {UIReview, DBReview};
  
import CartFoodItem from "@/types/cartFoodItem";
import Order from "@/types/order";
import { UIReview, DBReview } from "@/types/review";
import User from "@/types/user";
import { LoginFormSchema } from "@/validations/loginSchema";
import { ReviewFormSchema } from "@/validations/reviewSchema";
import { v4 as uuidv4 } from "uuid";
import MenuItem from "@/types/foodItem";

interface LoggedinUser extends User {
  id: number;
  orders: Order[];
  favorites: MenuItem[];
}

interface FoodItem {
  id: number;
  reviews: DBReview[];
}

// Fetches all users if no ID is provided, or fetches a specific user by ID if an ID is given.
const fetchUsers = async (
  id?: string
): Promise<LoggedinUser | LoggedinUser[]> => {
  const url = id
    ? `http://localhost:3000/users/${id}`
    : "http://localhost:3000/users";
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(response.status === 404 ? "User not found" : "DB error");
  const data = await response.json();
  if (Array.isArray(data) && data.length === 0 && !id)
    throw new Error("No users to fetch");
  return id ? (data as LoggedinUser) : (data as LoggedinUser[]);
};

export const createUser = async (data: User): Promise<Response | null> => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        orders: [], // orders field shouldn't be added manually rather it should be in the db schema
        favorites: [], // favorites field shouldn't be added manually rather it should be in the db schema
      }),
    });
    return response;
  } catch (error) {
    console.error("Error while registering", error);
    return null;
  }
};

export const authenticateUser = async (
  data: LoginFormSchema
): Promise<string | null> => {
  try {
    const users: LoggedinUser[] = (await fetchUsers()) as LoggedinUser[]; // Type assertion because fetchUsers() returns all users without any arguments

    // Checking credentials should be done on the server
    const user: LoggedinUser | undefined = users.find(
      (user) => user.email === data.email && user.password === data.password
    );

    if (user) {
      const token = user.id; // simulating a token. should use JWT
      const displayName = (user.fname[0] + user.lname[0]).toUpperCase();
      const favorites: MenuItem[] = user.favorites;
      return JSON.stringify({
        token: JSON.stringify(token),
        displayName: displayName,
        favorites: favorites,
      });
    } else {
      const error = "User not found";
      return error;
    }
  } catch (error) {
    console.error("Error while logging in", error);
  }
  return null;
};

export const placeUserOrder = async (
  data: CartFoodItem[]
): Promise<Response | null> => {
  try {
    // Fetch the user's data, update the orders array with the new order,
    // and then send a PATCH request to update the user record with the modified orders array.
    // In a real database, we could update the orders directly without needing to fetch the user data first.

    // Token should be placed in the headers and proccessed on the server
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication error: no authToken found");
    }
    const userID = JSON.parse(token);

    const user: LoggedinUser = (await fetchUsers(userID)) as LoggedinUser; // Type assertion as ID is provided

    const orders = user.orders;
    orders.push({
      date: new Date(),
      items: data,
    });

    const response = await fetch(`http://localhost:3000/users/${userID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orders: orders,
      }),
    });

    return response;
  } catch (error) {
    console.error("Error while placing order", error);
  }
  return null;
};

const fetchFoodItems = async (id?: number): Promise<FoodItem | FoodItem[]> => {
  const url = id
    ? `http://localhost:3000/food-items/${String(id)}`
    : "http://localhost:3000/food-items";
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(
      response.status === 404 ? "Food item not found" : "DB error"
    );
  const data = await response.json();
  if (Array.isArray(data) && data.length === 0 && !id)
    throw new Error("No food items to fetch");
  return id ? (data as FoodItem) : (data as FoodItem[]);
};

export const addReview = async (
  data: ReviewFormSchema,
  foodItemID: number
): Promise<{ response: Response; newReview: DBReview } | null> => {
  try {
    // Get the user id and name to associate the user with the review
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication error: no authToken found");
    }
    const userID = JSON.parse(token);

    const user: LoggedinUser = (await fetchUsers(userID)) as LoggedinUser; // Type assertion as ID is provided
    const name = user.fname + " " + user.lname;

    // Fetch food item, update the reviews array with the new review,
    // and then send a PATCH request to update the food item record with the modified reviews array.
    // In a real database, we could update the reviews directly without needing to fetch the food item first.
    const foodItem: FoodItem = (await fetchFoodItems(foodItemID)) as FoodItem; // Type assertion as ID is provided
    const reviews = foodItem.reviews;
    const newReview: DBReview = {
      reveiwID: uuidv4(),
      userID: userID,
      name: name,
      rating: data.rating,
      comment: data.comment,
    };
    reviews.push(newReview);

    const response = await fetch(
      `http://localhost:3000/food-items/${foodItemID}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviews: reviews,
        }),
      }
    );
    return { response, newReview };
  } catch (error) {
    console.error("Error adding review", error);
  }
  return null;
};

export const fetchOtherUsersReviews = async (
  foodItemID: number
): Promise<UIReview[] | null> => {
  try {
    const foodItem: FoodItem = (await fetchFoodItems(foodItemID)) as FoodItem; // Type assertion as ID is provided;

    // Get the user id and remove user reviews
    const token = localStorage.getItem("authToken");
    if (token) {
      const userID = JSON.parse(token);
      foodItem.reviews = foodItem.reviews.filter(
        (item) => item.userID !== userID
      );
    }

    // Remove 'userID' field from each review
    const reviewsWithoutUserID = foodItem.reviews.map(
      ({ userID, ...review }) => review
    );

    return reviewsWithoutUserID;
  } catch (error) {
    console.error("Error occurred while fetching other users reviews", error);
  }
  return null;
};

export const fetchUserReviews = async (foodItemID: number) => {
  try {
    // Get the user id and name to associate the user with the review
    const token = localStorage.getItem("authToken");
    if (token) {
      const userID = JSON.parse(token);
      const foodItem: FoodItem = (await fetchFoodItems(foodItemID)) as FoodItem; // Type assertion as ID is provided;
      const UserReviews = foodItem.reviews.filter(
        (item) => item.userID === userID
      );
      if (UserReviews.length !== 0) return UserReviews;
    }
  } catch (error) {
    console.error("Error occured while fetching user reviews", error);
  }
  return null;
};

export const updateUserReview = async (
  foodItemID: number,
  reveiwID: string,
  deleteItem: boolean = false,
  data?: ReviewFormSchema
): Promise<Response | null> => {
  try {
    if (!deleteItem && !data) {
      throw new Error("No new info provided");
    }

    // Get user id
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication error: no authToken found");
    }
    const userID = JSON.parse(token);

    // Get the target review
    const foodItem: FoodItem = (await fetchFoodItems(foodItemID)) as FoodItem;
    const reviews = foodItem.reviews;
    const review = reviews.find((item) => item.reveiwID === reveiwID);

    if (!review) {
      throw new Error("Review not found");
    }

    if (userID === review.userID) {
      // Check that the user changing the review is the correct user
      let updatedReviews: DBReview[] = reviews;
      if (deleteItem) {
        updatedReviews = updatedReviews.filter((item) => item !== review);
      } else {
        data = data as ReviewFormSchema; // If deleteItem is false then data will be present as an error will be thrown otherwise when the function is called
        review.rating = data.rating;
        review.comment = data?.comment;
        updatedReviews.forEach((item) =>
          item.reveiwID === reveiwID ? (item = review) : null
        );
      }
      const response = fetch(
        `http://localhost:3000/food-items/${String(foodItemID)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reviews: updatedReviews,
          }),
        }
      );
      return response;
    } else {
      throw new Error("Permission denied");
    }
  } catch (error) {
    console.error("Error while updating user review", error);
  }
  return null;
};

export const editFavorites = async (item: MenuItem, mode: string): Promise<Response | null> => {
  try {
    // Get user id and user
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("Authentication error: no authToken found");
    }
    const userID = JSON.parse(token);
    const user: LoggedinUser = (await fetchUsers(userID)) as LoggedinUser; // Type assertion as ID is provided

    let favorites = user.favorites
    if (mode === "add") favorites.push(item)
    else if (mode === "remove") favorites = favorites.filter((i) => i.id !== item.id)

    const response = fetch(`http://localhost:3000/users/${userID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        favorites: favorites
      })
    })

    return response
  } catch (error) {
    console.error("Error occurred while editing favorites", error);
  }
  return null
};

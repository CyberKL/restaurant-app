import { FoodItem } from "@/types/foodItem";
import User from "@/types/user";
import { LoginFormSchema } from "@/validations/loginSchema";

interface LoggedinUser extends User {
  id: number;
}
interface CartItem extends FoodItem {
  quantity: number,
}

export const createUser = async (data: User): Promise<Response | null> => {
  try {
    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        order: [] // Order field shouldn't be added manually rather it should be in the db schema
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
    const response = await fetch("http://localhost:3000/users");

    const users: LoggedinUser[] = await response.json();
    if (users) {
      const user: LoggedinUser | undefined = users.find(
        (user) => user.email === data.email && user.password === data.password
      );
      if (user) {
        const token = user.id; // simulating a token, should use JWT
        const displayName = (user.fname[0] + user.lname[0]).toUpperCase();
        return JSON.stringify({
          token: JSON.stringify(token),
          displayName: displayName,
        });
      }
      else {
        const error = "User not found";
        return error;
      }
    }
    return null;
  } catch (error) {
    console.error("Error while logging in", error);
    return null;
  }
};


export const placeUserOrder = async (data: CartItem[]): Promise<Response | null> => {
  try {
    const userID = JSON.parse(localStorage.getItem("authToken") as string) // Token should be placed in the headers and proccessed on the server
    const response = await fetch(`http://localhost:3000/users/${userID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: data
      })
    }) 
    return response;
  } catch (error) {
    console.error("Error while placing order", error)
    return null
  }
}
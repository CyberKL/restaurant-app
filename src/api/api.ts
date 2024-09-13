import CartFoodItem from "@/types/cartFoodItem";
import Order from "@/types/order";
import User from "@/types/user";
import { LoginFormSchema } from "@/validations/loginSchema";

interface LoggedinUser extends User {
  id: number;
  orders: Order[];
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
        orders: [], // Orders field shouldn't be added manually rather it should be in the db schema
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
      const token = user.id; // simulating a token, should use JWT
      const displayName = (user.fname[0] + user.lname[0]).toUpperCase();
      return JSON.stringify({
        token: JSON.stringify(token),
        displayName: displayName,
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

import CartFoodItem from "./cartFoodItem";

interface Order {
  date: Date;
  items: CartFoodItem[];
}

export default Order;

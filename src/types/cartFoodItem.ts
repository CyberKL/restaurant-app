import FoodItem from "./foodItem";

interface CartFoodItem extends FoodItem {
  quantity: number;
}

export default CartFoodItem;

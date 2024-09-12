import MenuItem from "../common/MenuItem";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { FoodItem } from "@/types/foodItem";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import MenuItemSkeleton from "../common/MenuItemSkeleton";

export default function FoodMenu() {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const cart = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/menu.json");
        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.error(error);
      }
    };

    fetchMenuItems();
  }, []);

  return error ? (
    <div>Couldn't fetch menu items</div>
  ) : (
    <div className="space-y-8 py-10 snap-start">
      <h1 className="text-center text-3xl text-green-700">Menu</h1>

      {loading ? (
        <div className="grid place-items-center gap-5 divide-y-2 w-full sm:px-0 px-6">
          <MenuItemSkeleton />
          <MenuItemSkeleton />
          <MenuItemSkeleton />
        </div>
      ) : (
        <div className="grid place-items-center gap-5 divide-y-2 w-full sm:px-0 px-6">
          {menuItems.map((item, index) => (
            <MenuItem
              id={item.id}
              title={item.title}
              description={item.description}
              price={item.price}
              image={item.image}
              quantity={cart.find((i) => i.id === item.id)?.quantity || 0}
              key={index}
            />
          ))}
        </div>
      )}

      {cart.length > 0 ? (
        <div className="fixed bottom-0 flex justify-center w-full py-5 bg-white border-t border-gray-300">
          <div className="grid grid-cols-2 gap-32 px-5">
            <Link to={"/cart"}>
              <Button
                variant={"outline"}
                size={"lg"}
                className="text-green-600 w-full hover:scale-110 transition"
              >
                Cart
              </Button>
            </Link>
            <Link to={"/checkout"}>
              <Button
                size={"lg"}
                className="bg-green-600 w-full hover:scale-110 transition"
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

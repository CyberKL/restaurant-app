import { CircleMinus, CirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { FoodItem } from "@/types/foodItem";
import { useDispatch } from "react-redux";
import { addItem, removeItem } from "@/features/cart/cartSlice";

interface MenuItemProps extends FoodItem {}

export default function MenuItem(props: MenuItemProps) {
  const [quantity, setQuantity] = useState<number>(0);

  const dispatch = useDispatch();
  
  const increment = (): void => {
    dispatch(addItem(props.id))
    setQuantity((prevState) => prevState + 1)
  }

  const decrement = (): void => {
    if (quantity > 0)
    {
      dispatch(removeItem(props.id))
      setQuantity((prevState) => prevState - 1)
    }
  }

  return (
    <div className="grid grid-cols-12 max-w-lg py-4">
      <div className="col-span-9 space-y-3">
        <div className="px-2 space-y-1">            
            <h1 className="text-2xl">{props.title}</h1>
            <p className="text-sm text-gray-600">{props.description}</p>
            <p>EGP {props.price}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={decrement}
          >
            <CircleMinus color="#16a34a" />
          </Button>
          <span>{quantity}</span>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={increment}
          >
            <CirclePlus color="#16a34a" />
          </Button>
        </div>
      </div>
      <div className="place-content-center col-span-3">
        <img src={props.image} alt="image" className="size-32" />
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CircleMinus, CirclePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "@/features/cart/cartSlice";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import CartFoodItem from "@/types/cartFoodItem";

interface CartItemProps extends CartFoodItem {}

export default function CartItem(props: CartItemProps) {
  const [quantity, setQuantity] = useState<number>(props.quantity);
  const [price, setPrice] = useState<number>(quantity * props.price);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increment = (): void => {
    if (isAuthenticated) {
      dispatch(addItem(props));
      setQuantity((prevState) => prevState + 1);
      setPrice((prevState) => prevState + props.price);
    } else {
      navigate("/login");
    }
  };

  const decrement = (): void => {
    if (isAuthenticated) {
      if (quantity > 0) {
        dispatch(removeItem(props.id));
        setQuantity((prevState) => prevState - 1);
        setPrice((prevState) => prevState - props.price);
      }
    } else {
      navigate("/login");
    }
  };

  if (quantity === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-12 max-w-lg sm:gap-8 gap-2 py-4">
      <img src={props.image} alt="image" className="col-span-2" />
      <div className="sm:col-span-8 col-span-6">
        <h1 className="sm:text-2xl text-lg">{props.title}</h1>
        <p className="sm:text-sm text-xs text-gray-600">{props.description}</p>
      </div>
      <div className="sm:col-span-2 col-span-4">
        <p className="text-center">EGP {price}</p>
        <div className="flex items-center gap-2">
          <Button variant={"ghost"} size={"icon"} onClick={decrement}>
            <CircleMinus color="#16a34a" />
          </Button>
          <span>{quantity}</span>
          <Button variant={"ghost"} size={"icon"} onClick={increment}>
            <CirclePlus color="#16a34a" />
          </Button>
        </div>
      </div>
    </div>
  );
}

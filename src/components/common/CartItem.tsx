import { Button } from "@/components/ui/button";
import { CircleMinus, CirclePlus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, clearItem } from "@/features/cart/cartSlice";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import CartFoodItem from "@/types/cartFoodItem";
import { useState } from "react";

interface CartItemProps extends CartFoodItem {}

export default function CartItem(props: CartItemProps) {
  const [action, setAction] = useState<string>("");
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increment = (): void => {
    if (isAuthenticated) {
      dispatch(addItem(props));
      setAction("increment");
    } else {
      navigate("/login");
    }
  };

  const decrement = (): void => {
    if (isAuthenticated) {
      dispatch(removeItem(props.id));
      setAction("decrement");
    } else {
      navigate("/login");
    }
  };

  const clear = (): void => {
    if (isAuthenticated) {
      dispatch(clearItem(props.id));
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="grid grid-cols-12 max-w-lg sm:gap-8 gap-2 py-4">
      <img src={props.image} alt="image" className="col-span-2" />
      <div className="sm:col-span-8 col-span-6 space-y-2">
        <div>
          <h1 className="sm:text-2xl text-lg">{props.title}</h1>
          <p className="sm:text-sm text-xs text-gray-600">
            {props.description}
          </p>
        </div>
      </div>
      <div className="sm:col-span-2 col-span-4 flex justify-center items-end">
        <Button variant={"ghost"} size={"icon"} onClick={clear}>
          <Trash2 color="#dc2626" />
        </Button>
      </div>
      <div className="flex justify-between items-center col-span-full">
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={decrement}
            className="active:scale-105"
          >
            <CircleMinus color="#16a34a" />
          </Button>
          <span
            className={`animate-in ${
              action === "increment"
                ? "slide-in-from-bottom-4"
                : action === "decrement"
                ? "slide-in-from-top-4"
                : ""
            }`}
            key={props.quantity}
          >
            {props.quantity}
          </span>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={increment}
            className="active:scale-105"
          >
            <CirclePlus color="#16a34a" />
          </Button>
        </div>
        <p className="text-center font-semibold">
          EGP {props.quantity * props.price}
        </p>
      </div>
    </div>
  );
}

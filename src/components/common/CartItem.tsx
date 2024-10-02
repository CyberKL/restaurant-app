import { Button } from "@/components/ui/button";
import { CircleMinus, CirclePlus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, clearItem } from "@/features/cart/cartSlice";
import { RootState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import CartFoodItem from "@/types/cartFoodItem";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CartItemProps extends CartFoodItem {}

export default function CartItem(props: CartItemProps) {
  const [action, setAction] = useState<string>("");
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [t] = useTranslation();

  // Handle incrementing the item quantity
  const increment = (): void => {
    if (isAuthenticated) {
      dispatch(addItem(props));
      setAction("increment");
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  // Handle decrementing the item quantity
  const decrement = (): void => {
    if (isAuthenticated) {
      dispatch(removeItem(props.id));
      setAction("decrement");
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  // Handle clearing the item from the cart
  const clear = (): void => {
    if (isAuthenticated) {
      dispatch(clearItem(props.id));
    } else {
      navigate("/login"); // Redirect to login if not authenticated
    }
  };

  return (
    <div className="grid grid-cols-12 max-w-lg sm:gap-8 gap-2 py-4" role="listitem">
      <img 
        src={props.image} 
        alt={props.title} // Improved alt text for better accessibility
        className="col-span-2" 
        loading="lazy" // Optimizes loading for performance
      />
      <div className="sm:col-span-8 col-span-6 space-y-2">
        <div>
          <h1 className="sm:text-2xl text-lg">{t(props.title)}</h1>
          <p className="sm:text-sm text-xs text-gray-600">
            {t(props.description)}
          </p>
        </div>
      </div>
      <div className="sm:col-span-2 col-span-4 flex justify-center items-end">
        <Button 
          variant={"ghost"} 
          size={"icon"} 
          onClick={clear} 
          aria-label={`Remove ${props.title} from cart`} // Adds aria-label for accessibility
        >
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
            aria-label={`Decrease quantity of ${props.title}`} // Adds aria-label for accessibility
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
            role="text" // Role for screen readers
          >
            {props.quantity}
          </span>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={increment}
            className="active:scale-105"
            aria-label={`Increase quantity of ${props.title}`} // Adds aria-label for accessibility
          >
            <CirclePlus color="#16a34a" />
          </Button>
        </div>
        <p className="text-center font-semibold" aria-live="polite"> {/* Aria live region for dynamic content updates */}
          {t('currency')} {props.quantity * props.price}
        </p>
      </div>
    </div>
  );
}

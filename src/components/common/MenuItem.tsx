import { CircleMinus, CirclePlus, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "@/features/cart/cartSlice";
import { RootState } from "@/app/store";
import { Link, useNavigate } from "react-router-dom";
import CartFoodItem from "@/types/cartFoodItem";
import { Rating } from "react-simple-star-rating";
import { handleFavorites } from "@/features/favorites/favoritesSlice";

interface MenuItemProps extends CartFoodItem {}

export default function MenuItem(props: MenuItemProps) {
  const [quantity, setQuantity] = useState<number>(props.quantity);
  const [action, setAction] = useState<string>("");
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const favorites = useSelector((state: RootState) => state.favorites);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increment = (): void => {
    if (isAuthenticated) {
      dispatch(addItem(props));
      setQuantity((prevState) => prevState + 1);
      setAction("increment");
    } else {
      navigate("/login");
    }
  };

  const decrement = (): void => {
    if (isAuthenticated) {
      if (quantity > 0) {
        dispatch(removeItem(props.id));
        setQuantity((prevState) => prevState - 1);
        setAction("decrement");
      }
    } else {
      navigate("/login");
    }
  };

  // Check if the item is currently favorited
  useEffect(() => {
    setIsFavorite(!!favorites.find((i) => i.id === props.id));
  }, [favorites]);

  return (
    <div className="grid grid-cols-12 max-w-lg py-4">
      <div className="col-span-9 space-y-3">
        <div className="px-2 space-y-1">
          <h1 className="text-2xl">{props.title}</h1>
          <p className="text-sm text-gray-600">{props.description}</p>
          <Rating
            readonly
            initialValue={props.rating}
            SVGclassName="inline-block"
            size={20}
            fillColor="#16a34a"
          />
          <p>EGP {props.price}</p>
        </div>
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
            {quantity}
          </span>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={increment}
            className="active:scale-105"
          >
            <CirclePlus color="#16a34a" />
          </Button>
          <Link to={`/item/${props.id}`}>
            <Button size={"sm"}>View item</Button>
          </Link>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() =>
              isAuthenticated
                ? dispatch(handleFavorites(props))
                : navigate("/login")
            }
          >
            <Star stroke="#16a34a" fill={isFavorite ? "#16a34a" : "white"} />
          </Button>
        </div>
      </div>
      <div className="place-content-center col-span-3">
        <img src={props.image} alt="image" className="size-32" />
      </div>
    </div>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useEffect, useState } from "react";
import FoodItem from "@/types/foodItem";
import { Button } from "@/components/ui/button";
import { CircleMinus, CirclePlus, Star } from "lucide-react";
import { RootState } from "@/app/store";
import { addItem, removeItem } from "@/features/cart/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import Reviews from "@/components/layout/Reviews";
import ReviewDialog from "@/components/common/ReviewDialog";
import { handleFavorites } from "@/features/auth/authSlice";
import { editFavorites } from "@/api/api";
import { useTranslation } from "react-i18next";

export default function Item() {
  const params = useParams(); // Gets URL parameters
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const cart = useSelector((state: RootState) => state.cart); // Subscribe to cart state to get quantity
  const [item, setItem] = useState<FoodItem>();
  const [quantity, setQuantity] = useState<number>(
    cart.find((i) => i.id === Number(params.id))?.quantity || 0
  ); // The quantity of the item in cart
  const [action, setAction] = useState<string>("");

  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const favorites = useSelector((state: RootState) => state.auth.favorites);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [t] = useTranslation();

  // Increment quantity in cart and UI
  const increment = (): void => {
    if (isAuthenticated) {
      dispatch(addItem(item as FoodItem));
      setQuantity((prevState) => prevState + 1);
      setAction("increment");
    } else {
      navigate("/login");
    }
  };

  // Decrement quantity in cart and UI
  const decrement = (): void => {
    if (isAuthenticated) {
      if (quantity > 0) {
        dispatch(removeItem(Number(params.id)));
        setQuantity((prevState) => prevState - 1);
        setAction("decrement");
      }
    } else {
      navigate("/login");
    }
  };

  // Gets the item entry from the DB
  useEffect(() => {
    const fetchItem = async () => {
      const response = await fetch(`/menu.json`);
      const items: FoodItem[] = await response.json();
      const foodItem = items.find((item) => item.id === Number(params.id));
      setItem(foodItem);
    };
    fetchItem();
  }, [params.id]); // Added params.id as dependency

  // Check if the item is currently favorited
  useEffect(() => {
    if (item) {
      setIsFavorite(!!favorites.find((i) => i.id === item.id));
    }
  }, [favorites, item]);

  // Handle favorites click event
  const handleFavoritesClick = async () => {
    if (isAuthenticated && item) {
      const mode = isFavorite ? "remove" : "add";
      const response = await editFavorites(item, mode);
      if (response && response.ok) {
        dispatch(handleFavorites(item));
      } else {
        console.error("Server Error: Item not favorited");
      }
    } else {
      navigate("/login");
    }
  };

  if (item)
    return (
      <>
        <Navbar />

        <main className="flex flex-col items-center  pt-20" aria-labelledby="item-title">
          <div className="space-y-60">
            <div className="max-w-3xl space-y-4">
              <img
                src={item?.image}
                alt={item?.title + " image"} // descriptive alt text
                className="h-72 w-full border-b border-gray-300"
                loading="lazy" // Lazy load images for performance
              />

              <div className="grid grid-cols-12">
                <div className="space-y-2 col-span-9">
                  <h1 id="item-title" className="text-3xl">{t(item?.title)}</h1>
                  <p className="text-gray-600">{t(item?.description)}</p>
                </div>
                <div className="col-span-3 flex items-center justify-end gap-2">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={decrement}
                    aria-label={t('item.decrement')} // aria-label for accessibility
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
                    key={quantity}
                    role="status" // Indicates that this element contains live region updates
                  >
                    {quantity}
                  </span>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={increment}
                    aria-label={t('item.increment')} // aria-label for accessibility
                    className="active:scale-105"
                  >
                    <CirclePlus color="#16a34a" />
                  </Button>
                </div>

                {/* Add to favorites button */}
                <div className="col-span-3 col-start-10 justify-end flex px-4">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={handleFavoritesClick}
                    aria-label={isFavorite ? t('item.removeFavorite') : t('item.addFavorite')} // aria-label for accessibility
                  >
                    <Star
                      stroke="#16a34a"
                      fill={isFavorite ? "#16a34a" : "white"}
                    />
                  </Button>
                </div>
              </div>
            </div>
            {/* Review section */}
            <div className="space-y-4">
              <ReviewDialog itemID={item.id} mode="add" />
              {/* Comments section */}
              <div className="py-14 space-y-5">
                <h1 className="font-bold text-xl">{t('item.reviews')}</h1>
                <Reviews foodItemID={item?.id} />
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <Toaster />
      </>
    );
}

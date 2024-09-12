import { RootState } from "@/app/store";
import CartItem from "@/components/common/CartItem";
import Navbar from "@/components/common/Navbar";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Cart() {
  const cartItems = useSelector((state: RootState) => state.cart)
  
  return (
    <div>
      <Navbar />
      {cartItems.length > 0 ? (
        <div className="grid place-items-center gap-5 divide-y-2 w-full pt-20 pb-32">
          {cartItems.map((item, index) => (
            <CartItem {...item} key={index} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center text-xl h-[80vh]">
          Looks like your cart is empty add items and come back!
        </div>
      )}
      <div className="fixed bottom-0 flex justify-center w-full py-5 bg-white border-t border-gray-300">
          <div className="grid grid-cols-2 gap-32 px-5">
            <Link to={"/"}>
              <Button
                variant={"outline"}
                size={"lg"}
                className="text-green-600 w-full hover:scale-110 transition"
              >
                Add Items
              </Button>
            </Link>
            <Link to={"/checkout"} className={`${cartItems.length === 0 ? 'pointer-events-none' : ''}`}>
              <Button
                size={"lg"}
                className="bg-green-600 w-full hover:scale-110 transition"
                disabled={cartItems.length === 0}
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>
    </div>
  )
}

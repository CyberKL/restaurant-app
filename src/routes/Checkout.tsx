import { RootState } from "@/app/store";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { placeUserOrder } from "@/api/api";
import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { clearCart } from "@/features/cart/cartSlice";

export default function Checkout() {
  const [error, setError] = useState<boolean>(false);
  const cart = useSelector((state: RootState) => state.cart);
  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart]
  );
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const placeOrder = async () => {
    const response = await placeUserOrder(cart);
    if (response && response.ok) {
      localStorage.removeItem("cart")
      dispatch(clearCart());
      navigate("/");
      toast({
        title: "Order Placed!",
        description: "Arriving in 60 minutes!",
      });
    } else {
      setError(true);
      setTimeout(() => {
        navigate("/")
        toast({
          title: "Order Not Placed",
          description: "Please try agian",
        })
      }, 1000);
    }
  };

  return (
    <div className="relative flex flex-col justify-center items-center h-screen sm:px-0 px-10">
      {/* Back button */}
      <div className="absolute top-0 left-0 p-5">
        <Link to={"/cart"}>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="hover:scale-110 transition"
          >
            <ChevronLeft color="#16a34a" />
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl w-full divide-y-2 space-y-5">
        {/* Payment options */}
        <div className="space-y-6">
          <div className="text-3xl font-bold">Pay with</div>
          <RadioGroup defaultValue="cash">
            <div className="flex items-center justify-between">
              <Label htmlFor="card" className="text-lg">
                Credit card
              </Label>
              <RadioGroupItem
                value="card"
                id="card"
                className="text-green-600 border-green-600 scale-125"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cash" className="text-lg">
                Cash
              </Label>
              <RadioGroupItem
                value="cash"
                id="cash"
                className="text-green-600 border-green-600 scale-125"
              />
            </div>
          </RadioGroup>
        </div>

        {/* Promo code */}
        <div className="py-4 space-y-6">
          <h1 className="text-3xl font-bold">Save on your order</h1>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="promo">Promo code</Label>
            <Input type="text" id="promo" placeholder="Enter promo code" />
          </div>
        </div>

        {/* Payment summary */}
        <div className="py-4 space-y-6">
          <h1 className="text-3xl font-bold">Payment Summary</h1>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{15}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>{(subtotal * 0.14).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>{(subtotal * 1.14 + 15).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div>
          <Button className="bg-green-600 w-full" onClick={placeOrder}>
            Place Order
          </Button>
        </div>
      </div>
      {error && (
        <div className="fixed bg-black opacity-80 size-full flex justify-center items-center px-5">
          <Alert variant="destructive" className="z-20 sm:max-w-xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              An error occurred while placing your order :(
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}

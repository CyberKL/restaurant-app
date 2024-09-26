import { RootState } from "@/app/store";
import Footer from "@/components/common/Footer";
import MenuItem from "@/components/common/MenuItem";
import Navbar from "@/components/common/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";

export default function Favorites() {
  const favorites = useSelector((state: RootState) => state.favorites);
  const cart = useSelector((state: RootState) => state.cart);
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center h-screen">
        <ScrollArea className="h-screen">
            <div className="divide-y-2">
            {favorites.map((item, index) => (
                <MenuItem
                {...item}
                key={index}
                quantity={cart.find((i) => i.id === item.id)?.quantity || 0}
                />
            ))}
            </div>
        </ScrollArea>
      </main>
      <Footer />
    </>
  );
}

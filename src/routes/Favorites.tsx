import { RootState } from "@/app/store";
import Footer from "@/components/common/Footer";
import MenuItem from "@/components/common/MenuItem";
import Navbar from "@/components/common/Navbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Favorites() {
  const favorites = useSelector((state: RootState) => state.auth.favorites);
  const cart = useSelector((state: RootState) => state.cart);
  const [t, i18n] = useTranslation();
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center h-screen">
        {favorites.length === 0 ? (
          <div className="h-full  place-content-center">
            <p>{t('favorites.empty')}</p>
          </div>
        ) : (
          <ScrollArea className="h-screen p-5" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
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
        )}
      </main>
      <Footer />
    </>
  );
}

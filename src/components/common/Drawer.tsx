import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Link as Scroll } from "react-scroll";
import { closeDrawer } from "@/features/drawer/drawerSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DrawerProps {
  open: boolean;
}

export default function Drawer({ open = false }: DrawerProps) {
  const location = useLocation();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation();

  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed inset-x-0 inset-y-20 h-full flex flex-col justify-between py-24 bg-white`}
      id="drawer"
      role="navigation"  // Role for better accessibility
      aria-label="Main navigation"  // Descriptive label for screen readers
    >
      <div className="px-5">
        <ul className="space-y-5 text-2xl">
          <li>
            <Link to={"/"} className="text-green-600 text-lg font-semibold">
              {t("navbar.menu.home")}
            </Link>
          </li>
          <li>
            {location.pathname === "/" ? (
              <Scroll
                to={"menu"}
                smooth={true}
                duration={200}
                onClick={() => dispatch(closeDrawer())}
                className="text-green-600 text-lg font-semibold cursor-pointer"
                aria-label={t("navbar.menu.menu")}
              >
                {t("navbar.menu.menu")}
              </Scroll>
            ) : (
              <Link
                to={"/"}
                className="text-green-600 text-lg font-semibold"
                onClick={() => dispatch(closeDrawer())}
                state={{ scrollToMenu: true }}
                aria-label={t("navbar.menu.menu")}
              >
                {t("navbar.menu.menu")}
              </Link>
            )}
          </li>
          <li>
            <Link
              to="/about"
              className="text-green-600 text-lg font-semibold text-nowrap"
              aria-label={t("navbar.menu.aboutUs")}
            >
              {t("navbar.menu.aboutUs")}
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-green-600 text-lg font-semibold"
              aria-label={t("navbar.menu.contact")}
            >
              {t("navbar.menu.contact")}
            </Link>
          </li>
          <li>
            <Link
              to="/offers"
              className="text-green-600 text-lg font-semibold"
              aria-label={t("navbar.menu.offers")}
            >
              {t("navbar.menu.offers")}
            </Link>
          </li>
          <li>
            <Link
              to="/locations"
              className="text-green-600 text-lg font-semibold"
              aria-label={t("navbar.menu.locations")}
            >
              {t("navbar.menu.locations")}
            </Link>
          </li>
          <li>
            <DropdownMenu dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              <DropdownMenuTrigger
                aria-label={t("navbar.menu.selectLang")}
              >
                <Globe color="#16a34a" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {t("navbar.menu.selectLang")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    i18n.changeLanguage("en");
                    document.body.setAttribute("dir", "ltr");
                  }}
                  dir="ltr"
                  aria-label="Switch to English"
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    i18n.changeLanguage("ar");
                    document.body.setAttribute("dir", "rtl");
                  }}
                  dir="rtl"
                  aria-label="Switch to Arabic"
                >
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>

      {/* Account section for authentication */}
      {!isAuthenticated && (
        <div className="grid grid-cols-1 justify-center gap-5 px-5">
          <Link to={"/login"}>
            <Button
              variant={"outline"}
              size={"lg"}
              className="text-green-600 text-lg font-semibold max-w-full w-full"
              aria-label={t("navbar.auth.login")}
            >
              {t("navbar.auth.login")}
            </Button>
          </Link>
          <Link to={"/register"}>
            <Button
              variant={"default"}
              size={"lg"}
              className="bg-green-600 text-lg font-semibold max-w-full w-full"
              aria-label={t("navbar.auth.register")}
            >
              {t("navbar.auth.register")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

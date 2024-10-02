import logo from "/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Drawer from "./Drawer";
import { Link as Scroll } from "react-scroll";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Globe, LogOut } from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { interactWithDrawer } from "@/features/drawer/drawerSlice";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const isDrawerOpen = useSelector((state: RootState) => state.drawer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const displayName = useSelector((state: RootState) => state.auth.displayName);

  const [t, i18n] = useTranslation();

  return (
    <nav
      className="px-4 py-4 lg:grid lg:grid-cols-12 flex justify-between border-b border-gray-300 bg-white sticky top-0 z-50"
      aria-label="Main Navigation"
    >
      {/* Drawer menu for mobile view */}
      <div className="lg:hidden block place-content-center">
        <Button
          variant={"ghost"}
          onClick={() => dispatch(interactWithDrawer())}
          className="text-green-600"
          aria-expanded={isDrawerOpen} // Indicates the state of the drawer
          aria-controls="drawer-menu" // Associates the button with the drawer content
        >
          {isDrawerOpen ? (
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30px"
              height="30px"
              viewBox="0 0 122.878 122.88"
              enableBackground="new 0 0 122.878 122.88"
              fill="#16a34a"
              aria-hidden="true" // Hides the icon from screen readers
            >
              <g>
                <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313z" />
              </g>
            </svg>
          ) : (
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              aria-hidden="true" // Hides the icon from screen readers
            >
              <path
                d="M4 18L20 18"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 12L20 12"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M4 6L20 6"
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </Button>
        <Drawer open={isDrawerOpen} aria-hidden={!isDrawerOpen} />{" "}
        {/* Adds ID and accessibility attributes to the drawer */}
      </div>

      {/* Logo section with link to home */}
      <div className="lg:col-span-2" dir="ltr">
        <Link
          to={"/"}
          className={`flex items-center justify-center ${
            i18n.language === "ar" ? "lg:justify-end" : "lg:justify-start"
          } lg:items-start lg:flex-col xl:flex-row xl:items-center gap-2`}
          aria-label="Home" // Provides clear link text for screen readers
        >
          <img src={logo} alt="GreenBite Logo" className="size-14" />
          <span className="text-green-600 text-2xl">GreenBite</span>
        </Link>
      </div>

      {/* Placeholder to make justify-between work */}
      {!isAuthenticated && <div className="lg:hidden block w-[62px]"></div>}

      {/* Navigations section */}
      <div className="col-span-8 place-content-center hidden lg:block">
        <ul
          className="flex items-center gap-5 justify-center"
          role="navigation"
        >
          <li>
            <Link
              to={"/"}
              className="text-green-600 text-lg font-semibold"
              aria-label="Home"
            >
              {t("navbar.menu.home")}
            </Link>
          </li>
          <li>
            {location.pathname === "/" ? (
              <Scroll
                to={"menu"}
                smooth={true}
                duration={200}
                className="text-green-600 text-lg font-semibold cursor-pointer"
                aria-label="Menu"
              >
                {t("navbar.menu.menu")}
              </Scroll>
            ) : (
              <Link
                to={"/"}
                className="text-green-600 text-lg font-semibold"
                state={{ scrollToMenu: true }}
                aria-label="Menu"
              >
                {t("navbar.menu.menu")}
              </Link>
            )}
          </li>
          <li>
            <Link
              to="/about"
              className="text-green-600 text-lg font-semibold text-nowrap"
              aria-label="About Us"
            >
              {t("navbar.menu.aboutUs")}
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-green-600 text-lg font-semibold"
              aria-label="Contact"
            >
              {t("navbar.menu.contact")}
            </Link>
          </li>
          <li>
            <Link
              to="/offers"
              className="text-green-600 text-lg font-semibold"
              aria-label="Offers"
            >
              {t("navbar.menu.offers")}
            </Link>
          </li>
          <li>
            <Link
              to="/locations"
              className="text-green-600 text-lg font-semibold"
              aria-label="Locations"
            >
              {t("navbar.menu.locations")}
            </Link>
          </li>
          <li className="flex items-center">
            <DropdownMenu dir={i18n.language === "ar" ? "rtl" : "ltr"}>
              <DropdownMenuTrigger>
                <Globe color="#16a34a" aria-label="Select Language" />{" "}
                {/* Added aria-label */}
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

      {/* Account section */}
      {isAuthenticated ? (
        <div className="col-span-2 flex justify-end px-8">
          <DropdownMenu dir={i18n.language === "ar" ? "rtl" : "ltr"}>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback className="bg-green-600 text-white">
                  {displayName}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{t("navbar.account.title")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                {t("navbar.account.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/cart")}>
                {t("navbar.account.cart")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/order-history")}>
                {t("navbar.account.orderHistory")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/favorites")}>
                {t("navbar.account.favorites")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => dispatch(logout())}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("navbar.account.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="lg:flex lg:flex-col xl:flex-row lg:items-end gap-4 col-span-2 justify-end hidden items-center">
          <Link to={"/login"}>
            <Button
              variant={"outline"}
              size={"lg"}
              className="text-green-600 text-lg font-semibold"
              aria-label="Login"
            >
              {t("navbar.auth.login")}
            </Button>
          </Link>
          <Link to={"/register"}>
            <Button
              variant={"default"}
              size={"lg"}
              className="bg-green-600 text-lg font-semibold"
              aria-label="Register"
            >
              {t("navbar.auth.register")}
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}

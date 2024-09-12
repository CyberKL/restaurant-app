import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Link as Scroll } from "react-scroll";
import { closeDrawer } from "@/features/drawer/drawerSlice";

interface DrawerProps {
  open: boolean;
}

export default function Drawer({ open = false }: DrawerProps) {
  const location = useLocation();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dispatch = useDispatch()
  
  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed inset-x-0 inset-y-20 h-full flex flex-col justify-between py-24 bg-white`}
      id="drawer"
    >
      <div className="px-5">
        <ul className="space-y-5 text-2xl">
          <li>
            {location.pathname === "/" ? (
              <Scroll
                to={"menu"}
                smooth={true}
                duration={200}
                className="text-green-600 font-semibold cursor-pointer"
                onClick={() => dispatch(closeDrawer())}
              >
                Menu
              </Scroll>
            ) : (
              <Link
                to={"/"}
                className="text-green-600 font-semibold"
                state={{ scrollToMenu: true }}
                onClick={() => dispatch(closeDrawer())}
              >
                Menu
              </Link>
            )}
          </li>
          <li>
            <Link to="/about" className="text-green-600 font-semibold">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-green-600 font-semibold">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/offers" className="text-green-600 font-semibold">
              Offers
            </Link>
          </li>
          <li>
            <Link to="/locations" className="text-green-600 font-semibold">
              Locations
            </Link>
          </li>
        </ul>
      </div>

      {/* Account */}
      {!isAuthenticated && (
        <div className="grid grid-cols-1 gap-5 px-5">
          <Link to={"/login"}>
            <Button
              variant={"outline"}
              size={"lg"}
              className="text-green-600 text-lg font-semibold"
            >
              Login
            </Button>
          </Link>
          <Link to={"/register"}>
            <Button
              variant={"default"}
              size={"lg"}
              className="bg-green-600 text-lg font-semibold"
            >
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

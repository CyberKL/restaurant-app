import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface DrawerProps {
  open: boolean;
}

export default function Drawer({ open = false }: DrawerProps) {
  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } fixed inset-x-0 inset-y-20 h-full flex flex-col justify-between py-24 bg-white`}
    >
      <div className="px-5">
        <ul className="space-y-5 text-2xl">
          <li>
            <Link to={""} className="text-green-600 font-semibold">
              Menu
            </Link>
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
    </div>
  );
}

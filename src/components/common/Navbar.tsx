import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import Drawer from "./Drawer";
import { useState } from "react";
import { Link as Scroll } from "react-scroll";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <nav className="px-4 py-4 md:grid md:grid-cols-12 flex justify-between border-b border-gray-300 bg-white sticky top-0 z-50">
      {/* Drawer menu */}
      <div className="md:hidden block place-content-center">
        <Button
          variant={"ghost"}
          onClick={() => setIsDrawerOpen((prevState) => !prevState)}
          className="text-green-600"
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
              enable-background="new 0 0 122.878 122.88"
              fill=" #16a34a"
            >
              <g>
                <path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127l53.127-53.127 c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128c1.901,1.901,1.901,4.984,0,6.886 c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453c-1.901,1.902-4.984,1.902-6.886,0 c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313L1.426,8.313z" />
              </g>
            </svg>
          ) : (
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
        <Drawer open={isDrawerOpen} />
      </div>

      {/* Logo section */}
      <div className="col-span-4 place-content-center">
        <Link to={"/"} className="flex items-center gap-2">
          <img src={logo} alt="logo" className="size-14" />
          <span className="text-green-600 text-2xl">GreenBite</span>
        </Link>
      </div>

      {/* Placeholder to make justify-between work */}
      <div className="md:hidden block"></div>

      {/* Navigations section */}
      <div className="col-span-4 place-content-center hidden md:block">
        <ul className="flex items-center gap-5 justify-center">
          <li>
            <Scroll
              to={"menu"}
              smooth={true}
              duration={200}
              className="text-green-600 text-lg font-semibold cursor-pointer"
            >
              Menu
            </Scroll>
          </li>
          <li>
            <Link to="/about" className="text-green-600 text-lg font-semibold">
              About Us
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="text-green-600 text-lg font-semibold"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link to="/offers" className="text-green-600 text-lg font-semibold">
              Offers
            </Link>
          </li>
          <li>
            <Link
              to="/locations"
              className="text-green-600 text-lg font-semibold"
            >
              Locations
            </Link>
          </li>
        </ul>
      </div>

      {/* Account section */}
      <div className="md:flex md:flex-col lg:flex-row md:items-end gap-4 col-span-4 justify-end hidden items-center">
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
    </nav>
  );
}

import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import FoodMenu from "@/components/layout/FoodMenu";
import Hero from "@/components/common/Hero";
import { Element } from "react-scroll";
import { Toaster } from "@/components/ui/toaster";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === "/" && location.state?.scrollToMenu) {
      const menuSection = document.getElementById("menu");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div>
      <Navbar />
      <Hero />
      <Element name="menu" id="menu">
        <FoodMenu />
      </Element>
      <Footer />
      <Toaster />
    </div>
  );
}

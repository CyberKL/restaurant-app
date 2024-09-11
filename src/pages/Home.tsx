import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import FoodMenu from "@/components/layout/FoodMenu";
import Hero from "@/components/common/Hero";
import { Element } from "react-scroll";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Element name="menu">
        <FoodMenu />
      </Element>
      <Footer />
    </div>
  );
}

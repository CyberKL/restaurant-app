import { RootState } from "@/app/store";
import ScrollToTop from "@/components/common/ScrollToTop";
import Cart from "@/routes/Cart";
import Checkout from "@/routes/Checkout";
import Home from "@/routes/Home";
import Login from "@/routes/Login";
import NotFound from "@/routes/NotFound";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Register from "@/routes/Register";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Router() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/basic/Header.jsx';
import Footer from './components/basic/Footer.jsx';
import Home from "./pages/Home.jsx";
import AmazonVideo from "./pages/AmazonVideo.jsx";
import UserAmazon from "./pages/UserAmazon.jsx";
import Coupons from "./pages/Coupons.jsx";
import CustomerService from "./pages/CustomerService.jsx";
import History from "./pages/History.jsx";
import TodaysDeal from "./pages/TodaysDeal.jsx";
import Registry from "./pages/Registry.jsx";
import BuyAgain from "./pages/BuyAgain.jsx";
import GiftCards from "./pages/GiftCards.jsx";
import Sell from "./pages/Sell.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import VideoDetails from "./pages/VideoDetails.jsx";
import CustomerPreferences from "./pages/CustomerPreferences.jsx";
import Account from "./pages/Account.jsx";
import Orders from "./pages/Orders.jsx";
import Cart from "./pages/Cart.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";

function MainLayout() {
  return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
  );
}

function CleanLayout() {
  return (
      <>
        <Outlet />
      </>
  )
}

function App() {
  return (
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route element={<MainLayout />} >
              <Route path="/" element={<Home />} />
              <Route path="/amazon-video" element={<AmazonVideo />} />
              <Route path="/yourstore/home" element={<UserAmazon />} />
              <Route path="/coupons" element={<Coupons />} />
              <Route path="/contact-us" element={<CustomerService />} />
              <Route path="/history" element={<History />} />
              <Route path="/labordaysale" element={<TodaysDeal />} />
              <Route path="/registries" element={<Registry />} />
              <Route path="/buyagain" element={<BuyAgain />} />
              <Route path="/gift-cards" element={<GiftCards />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/video/:id" element={<VideoDetails />} />

              <Route path="/customer-preferences" element={<CustomerPreferences />} />
              <Route path="/your-account" element={<Account />} />
              <Route path="/your-orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
            </Route>

            <Route element={<CleanLayout />} >
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

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
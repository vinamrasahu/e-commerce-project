import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./features/home/Home";
import Product from "./features/products/Product";
import ProductDetail from "./features/products/ProductDetail";
import LoginRegister from "./components/layout/Login";
import ProductDetailPage from "./features/products/ProductDetailPage";
import AdminDashboard  from  "./features/admin/Dashboard";
import ForgotPassword from "./components/layout/pages/forgot-password";
import ResetPassword from "./components/layout/pages/ResetPassword";
import { AddProductPanel } from "./features/admin/Addprouct";
import { SlidersPanels } from "./features/admin/AddSlideForm";
import BlogPostPage from "./components/layout/blog/BlogDetails";
import ContactPage from "./features/profile/ConnectPage";
import Contact from "./features/profile/contact/Contact";
import BlogPage from "./components/layout/blog/Blogpage";
import FloneCartPage from "./features/cart/MainCart";
import { useDispatch } from "react-redux";
import { setCart } from "./features/cart/cartSlice";
import { getCart } from "./services/cartService";
import WishlistPage from "./features/wishlist/Wishlist";
import { fetchLikes } from "./redux/likeSlice";
import CheckoutPage from "./features/cart/Checkout";
import OrderHistory from "./components/layout/UserOder";


const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load Cart
        const cartRes = await getCart();
        dispatch(setCart(cartRes.data || []));
  
        // Load Wishlist
        dispatch(fetchLikes());
  
      } catch (err) {
        console.error(err);
      }
    };
  
    loadData();
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <ProductDetail/>   } />
        <Route path="/home" element={<Home />}/>
       <Route path="/Register" element={<LoginRegister/>}/>
             
       
       <Route path="/product/:id" element={<ProductDetailPage />} />
       <Route path="/admin" element={<AdminDashboard/>}/>
        <Route path="/wishlist" element={<WishlistPage/>}/>

       <Route path="/forgot-password" element={<ForgotPassword/>}/>
       <Route path="/reset-password"  element={<ResetPassword/>}/>


       

           <Route path="/Addproduct" element={<AddProductPanel/>}/>
           <Route path="/add-slider" element={<SlidersPanels/>}/>

    

    <Route path="/contact" element={<Contact/>}/>

         <Route path="/blog" element={<BlogPage/>}/>
         <Route path="/blog/:id" element={<BlogPostPage/>}/>
         


         <Route path="/add-to-cart" element={<FloneCartPage/>}/>


         <Route path="/checkout"  element={<CheckoutPage/>}/> 

         <Route path="/myorders" element={<OrderHistory/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
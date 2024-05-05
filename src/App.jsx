import './App.css';

import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';

import ChatList from './components/Chat/ChatList';
import ForgotPassword from './components/Authentication/ForgotPassword';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatInit from './components/Chat/ChatInit';

import MyAccount from './components/MyAccount/MyAccount';

import SellProduct from './components/Product/SellProduct';
import Product from './components/Product/Product';
import MyProducts from './components/Product/MyProducts';

import ProductInfo from './components/Product/ProductInfo';
import MyProductInfo from './components/Product/MyProductInfo';
import Cart from './components/Cart/Cart';


function App() {
 
  
 
  return (
    <BrowserRouter>
    
    
      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Product />} />
          <Route path="/chatinit" element={<ChatInit/>}/>
          <Route path="/inbox" element ={<ChatList/>}/>
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/myaccount" Component={MyAccount}/>
          <Route path="/sellproduct" Component={SellProduct}/>
          <Route path="/product" Component={Product}/>
          <Route path="/myproducts" element={<MyProducts/>}/>
          <Route path="/myproductsinfo/:item" element={<MyProductInfo/>}/>
          <Route path="/productinfo/:item" element={<ProductInfo />} />
          <Route path="/wishlist" Component={Cart}></Route>
                      {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
        
  
    
  
    </BrowserRouter>
  );
}

export default App;
//For the product.js : we have to display the individual product cards and render each product card. The props we will be p
//passing will be al the product detail including the  product id. When we click on the product card we will go to the ProductDetails.js page where we will have the product details displayed and a Message Seller button
//on the product page we will also have the filtering settings where we will filter products by category and also order them by price

//we will also have a nav bar to the left of the screen. The navbar will contain My Account,My Products, Browse Products, Sell Product snd Inbox

//In the myproducts page we will render the products components owned by the user. There will also be an Edit Details button and Change picture button

//
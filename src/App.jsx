import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext'; // Import AuthContextProvider and useAuthContext
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import ChatList from './components/Chat/ChatList';
import MyAccount from './components/MyAccount/MyAccount';
import SellProduct from './components/Product/SellProduct';
import Product from './components/Product/Product';
import MyProducts from './components/Product/MyProducts';
import ProductInfo from './components/Product/ProductInfo';
import MyProductInfo from './components/Product/MyProductInfo';
import Cart from './components/Cart/Cart';
import ForgotPassword from './components/Authentication/ForgotPassword';
import ChatInit from './components/Chat/ChatInit'
function App() {
  const { user } = useAuthContext();
  console.log(user)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chatinit" element={user ? <ChatInit /> : <Navigate to="/" />} />
        <Route path="/inbox" element={user ? <ChatList /> : <Navigate to="/" />} />
        <Route path="/myaccount" element={user ? <MyAccount /> : <Navigate to="/" />} />
        <Route path="/sellproduct" element={user ? <SellProduct /> : <Navigate to="/" />} />
        <Route path="/product" element={user ? <Product /> : <Navigate to="/" />} />
        <Route path="/myproducts" element={user ? <MyProducts /> : <Navigate to="/" />} />
        <Route path="/myproductsinfo/:item" element={user ? <MyProductInfo /> : <Navigate to="/" />} />
        <Route path="/productinfo/:item" element={user ? <ProductInfo /> : <Navigate to="/" />} />
        <Route path="/wishlist" element={user ? <Cart /> : <Navigate to="/" />} />
        <Route path="/home" element={user ? <Product /> : <Navigate to="/" />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

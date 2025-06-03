import { useDispatch, useSelector } from 'react-redux';
import { Protected } from './features/auth/components/Protected';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import AdminHome from './pages/AdminHome';     
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignupPage from './pages/SignupPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { useEffect } from 'react';
import { selectLoggedInUser } from './features/auth/AuthSlice';
import { fetchItemsByUserIdAsync } from './features/cart/CartSlice';
import PageNotFound from './pages/PageNotFound';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserOrderPage from './pages/UserOrderPage';
import UserProfile from './features/user/components/UserProfile';
import { fetchLoggedInUserAsync } from './features/user/UserSlice';
import ProtectedAdmin from './features/auth/components/ProtectedAdmin';
import AdminProductDetailPage from './pages/AdminProductDetailPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminOrders from './features/admin/components/AdminOrders';
import AdminOrdersPage from './pages/AdminOrdersPage';
const router = createBrowserRouter([
  {
    path: "/",
    element:(<Protected><Home></Home></Protected>),
  },
  {
    path: "/admin",
    element:(<ProtectedAdmin><AdminHome></AdminHome></ProtectedAdmin>),
  },
  {
    path: "/login",
    element:(<LoginPage></LoginPage>),
  },
  {
    path: "/signup",
    element:(<SignupPage/>),
  },
  {
    path: "/cart",
    element:(<Protected><CartPage/></Protected>),
  },
  {
    path: "/checkout",
    element:(<Protected><Checkout/></Protected>),
  },
  {
    path: "/product-detail/:id",
    element:(<Protected><ProductDetailPage/></Protected>),
  },
  {
    path: "/admin/product-detail/:id",
    element:(<ProtectedAdmin><AdminProductDetailPage></AdminProductDetailPage></ProtectedAdmin>),
  },
  {
    path: "/admin/orders",
    element:(<ProtectedAdmin><AdminOrdersPage/></ProtectedAdmin>),
  },
  {
    path: "/admin/product-form",
    element:(<ProtectedAdmin><AdminProductFormPage/></ProtectedAdmin>),
  },
  {
    path: "/admin/product-form/edit/:id",
    element:(<ProtectedAdmin><AdminProductFormPage/></ProtectedAdmin>),
  },
  {
    path: "/order-success/:id",
    element:(<OrderSuccessPage/>),
  },
  {
    path: "/orders",
    element:(<UserOrderPage/>),
    //we will add page later of this 
  },
  {
    path: "/profile",
    element:(<UserProfile/>),
    //we will add page later of this 
  },
  {
    path: "*",
    element:(<PageNotFound></PageNotFound>),
  },
]);
function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser)
  useEffect(()=>{
    if(user){
      dispatch(fetchItemsByUserIdAsync(user.id))
      dispatch(fetchLoggedInUserAsync(user.id))
    }
    
  },[dispatch,user])
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;


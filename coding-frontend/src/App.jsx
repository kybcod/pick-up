import { ChakraProvider } from "@chakra-ui/react";
import React, { useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home.jsx";
import RestaurantMapView from "./page/restaurant/RestaurantMapView.jsx";
import "./component/styles/fonts.css";
import { theme } from "./component/styles/theme.jsx";
import { RestaurantMenuList } from "./page/menu/RestaurantMenuList.jsx";
import Login from "./page/user/Login.jsx";
import { Signup } from "./page/user/Signup.jsx";
import { LoginContext, LoginProvider } from "./component/LoginProvider.jsx";
import { CartList } from "./page/myPage/CartList.jsx";
import { Payment } from "./page/payment/Payment.jsx";
import { OrderList } from "./page/myPage/OrderList.jsx";
import ReviewList from "./page/myPage/ReviewList.jsx";
import RestaurantRegistrationProcess from "./page/seller/register/RestaurantRegistrationProcess.jsx";
import SellerMainPage from "./page/seller/SellerMainPage.jsx";
import SellerOrderList from "./page/seller/SellerOrderList.jsx";
import SellerRestaurantList from "./page/seller/SellerRestaurantList.jsx";
import { MyPage } from "./page/user/MyPage.jsx";
import axios from "axios";
import NaverLoginCallback from "./page/user/NaverLoginCallback.jsx";
import FavoriteList from "./page/myPage/FavoriteList.jsx";
import RestaurantEditProcess from "./page/seller/edit/RestaurantEditProcess.jsx";
import SellerReviewList from "./page/seller/SellerReviewList.jsx";
import { MainPage } from "./page/main/MainPage.jsx";

axios.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

function ConditionalRedirect() {
  const account = useContext(LoginContext);

  if (account.isLoggedIn()) {
    return account.isSeller() ? <SellerMainPage /> : <MainPage />;
  }
  return <MainPage />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      // user
      { index: true, element: <ConditionalRedirect /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "oauth/login", element: <NaverLoginCallback /> },
      { path: "mypage/:userId", element: <MyPage /> },

      // map
      { path: "restaurant/:categoryId", element: <RestaurantMapView /> },
      { path: "menu/:placeId", element: <RestaurantMenuList /> },

      //drawer
      { path: "carts", element: <CartList /> },
      { path: "orders", element: <OrderList /> },
      { path: "favorites", element: <FavoriteList /> },
      { path: "reviews", element: <ReviewList /> },

      //pay
      {
        path: "pay/buyer/:userId/restaurant/:restaurantId",
        element: <Payment />,
      },

      //seller
      { path: "seller", element: <SellerMainPage /> },
      { path: "seller/register", element: <RestaurantRegistrationProcess /> },
      { path: "seller/orders", element: <SellerOrderList /> },
      { path: "seller/restaurants", element: <SellerRestaurantList /> },
      { path: "seller/:restaurantId", element: <RestaurantEditProcess /> },
      { path: "seller/:restaurantId/reviews", element: <SellerReviewList /> },
    ],
  },
]);

function App(props) {
  return (
    <LoginProvider>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;

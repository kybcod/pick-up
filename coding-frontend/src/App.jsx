// App.jsx
import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home.jsx";
import RestaurantMapView from "./page/restaurant/RestaurantMapView.jsx";
import "./component/styles/fonts.css";
import { theme } from "./component/styles/theme.jsx";
import { MainPage } from "./page/mainPage/MainPage.jsx";
import { RestaurantMenuList } from "./page/menuSelector/RestaurantMenuList.jsx";
import Login from "./page/user/Login.jsx";
import { Signup } from "./page/user/Signup.jsx";
import { OAuthRedirectHandler } from "./page/user/OAuthRedirectHandler.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import { CartList } from "./page/myPage/CartList.jsx";
import { Payment } from "./page/payment/Payment.jsx";
import { OrderList } from "./page/myPage/OrderList.jsx";
import ReviewList from "./page/myPage/ReviewList.jsx";
import RestaurantRegistrationProcess from "./page/register/RestaurantRegistrationProcess.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      // user
      { index: true, element: <MainPage /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "oauth/login", element: <OAuthRedirectHandler /> },
      // map
      { path: "restaurant/:categoryId", element: <RestaurantMapView /> },
      { path: "menu/:placeId", element: <RestaurantMenuList /> },

      //drawer
      { path: "carts", element: <CartList /> },
      { path: "orders", element: <OrderList /> },
      { path: "reviews", element: <ReviewList /> },
      { path: "register", element: <RestaurantRegistrationProcess /> },

      //pay
      {
        path: "pay/buyer/:userId/restaurant/:restaurantId",
        element: <Payment />,
      },
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

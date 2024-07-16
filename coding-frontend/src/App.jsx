import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home.jsx";
import RestaurantMapView from "./restaurant/RestaurantMapView.jsx";
import "./styles/fonts.css";
import { theme } from "./component/theme.jsx";
import { MainPage } from "./restaurant/MainPage.jsx";
import { RestaurantMenuList } from "./restaurant/RestaurantMenuList.jsx";
import Login from "./User/Login.jsx";
import { Signup } from "./User/Signup.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      // user
      { index: true, element: <MainPage /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      // map
      { path: "restaurant", element: <RestaurantMapView /> },
      { path: "menu/:placeId", element: <RestaurantMenuList /> },
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

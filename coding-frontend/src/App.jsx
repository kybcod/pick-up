import {ChakraProvider, MenuList} from "@chakra-ui/react";
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./Home.jsx";
import RestaurantMapView from "./restaurant/RestaurantMapView.jsx";
import "./fonts.css";
import {theme} from "./component/theme.jsx";
import {MainPage} from "./restaurant/MainPage.jsx";
import {RestaurantMenuList} from "./restaurant/RestaurantMenuList.jsx";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        children:[
            {index:true, element:<MainPage/>},

                // user

                // map
            {path:"restaurant", element:<RestaurantMapView/>},
            {path:"menu/:storeId", element:<RestaurantMenuList/>},

        ]
    }
])
function App(props) {
    return (
        <ChakraProvider theme={theme}>
            <RouterProvider router={router} />
        </ChakraProvider>
    );
}

export default App;
import {ChakraProvider} from "@chakra-ui/react";
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./Home.jsx";
import MapView from "./Map/MapView.jsx";
import "./fonts.css";
import {theme} from "./component/theme.jsx";
import {MainPage} from "./pickUp/mainPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        children:[

                // user
            {index:true, element:<MainPage/>},
                // map
            {path:"map", element:<MapView/>},
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
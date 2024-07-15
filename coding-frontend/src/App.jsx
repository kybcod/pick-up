import {ChakraProvider} from "@chakra-ui/react";
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./Home.jsx";
import MapView from "./Map/MapView.jsx";
import Login from "./User/Login.jsx";
import {Signup} from "./User/Signup.jsx";

function MainPage() {
    return null;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        children:[

                // user
            {index:true, element:<MainPage/>},
            {path:"signup", element: <Signup/>},
            {path:"login", element:<Login/>},
                // map
            {path:"map", element:<MapView/>},
        ]
    }
])
function App(props) {
    return (
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
    );
}

export default App;
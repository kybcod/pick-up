import {ChakraProvider} from "@chakra-ui/react";
import React from 'react';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./Home.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
        children:[
            {}
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
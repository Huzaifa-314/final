import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Main from "./Layout/Main";
import Home from "./Pages/Home";


import Listings from "./Pages/Listing/All/Listings";
import CreateListing from "./Pages/Listing/Create/CreateListing";
import LoginPage from "./Pages/LoginPage";

import Signup from "./Pages/Signup";
import AuthProvider from "./Providers/AuthProvider";
import Mapinput from "./Pages/Map/Mapinput";
import DetailsPage from "./Pages/complaindetails";
import Voice from "./Pages/Voice";
import Chatbot from "./components/Chatbot/Chatbot";
import UploadImage from "./Pages/UploadImage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <LoginPage></LoginPage>,
      },
      {
        path: "/details/:id",
        element:<DetailsPage></DetailsPage> ,
      },
 
      {
        path: "/listing/new",
        element: <CreateListing />,
      },
      {
        path: "/listing",
        element: <Listings />,
      },
      {
        path: "/signup",
        element: <Signup></Signup>,
      },
      {
        path: "/heat",
        element: <Mapinput></Mapinput>
      },
      {
        path: "/chatbot",
        element: <Chatbot></Chatbot>
      },
      {
        path: "/voice",
        element:<Voice></Voice>
      },
      {
        path: "/image",
        element:<UploadImage></UploadImage>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <div className="mx-auto">
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </React.StrictMode>
  </div>
);

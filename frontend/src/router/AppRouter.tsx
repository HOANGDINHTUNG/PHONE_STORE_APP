import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetail from "../pages/ProductDetail";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import { AccountOverviewPage } from "../features/account/pages/AccountOverviewPage";
import { OrderHistoryPage } from "../features/account/pages/OrderHistoryPage";
import {
  MyReviewsPage,
  ReturnsPage,
  NotificationsPage,
} from "../features/account/pages/AccountActivityPages";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import EmailVerification from "../pages/EmailVerification";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:slug",
        element: <ProductDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/account",
    element: <AccountOverviewPage />,
  },
  {
    path: "/account/orders",
    element: <OrderHistoryPage />,
  },
  {
    path: "/account/reviews",
    element: <MyReviewsPage />,
  },
  {
    path: "/account/returns",
    element: <ReturnsPage />,
  },
  {
    path: "/account/notifications",
    element: <NotificationsPage />,
  },
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/verify-email",
    element: <EmailVerification />,
  },
]);

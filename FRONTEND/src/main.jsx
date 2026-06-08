/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import App from "./App.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ContentManagement from "./components/admin/ContentManagement.jsx";
import EventsManagement from "./components/admin/EventsManagement.jsx";
import ItemsManagement from "./components/admin/ItemsManagement.jsx";
import MissionsManagement from "./components/admin/MissionsManagement.jsx";
import OrdersManagement from "./components/admin/OrdersManagement.jsx";
import ProductsManagement from "./components/admin/ProductsManagement.jsx";
import RolesPermissions from "./components/admin/RolesPermissions.jsx";
import TransactionsManagement from "./components/admin/TransactionsManagement.jsx";
import UsersManagement from "./components/admin/UsersManagement.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import CustomerDashboard from "./components/customer/CustomerDashboard.jsx";
import CustomerEvents from "./components/customer/CustomerEvents/CustomerEvents.jsx";
import CustomerItems from "./components/customer/CustomerItems/index.jsx";
import CustomerOrders from "./components/customer/CustomerOrders.jsx";
import CustomerProfile from "./components/customer/CustomerProfile.jsx";
import CustomerQRScanner from "./components/customer/CustomerQRScanner/CustomerQRScanner.jsx";
import CustomerRewards from "./components/customer/CustomerRewards.jsx";
import CustomerUsers from "./components/customer/CustomerUsers/CustomerUsers.jsx";
import AllItemsTab from "./components/features/exchangemarket/AllItemsTab.jsx";
import RedeemTab from "./components/features/exchangemarket/RedeemTab.jsx";
import UserItemsTab from "./components/features/exchangemarket/UserItemsTab.jsx";
import Address from "./components/features/user/Address.jsx";
import ChangePassword from "./components/features/user/ChangePassword.jsx";
import DeleteAccount from "./components/features/user/DeleteAccount.jsx";
import MissionCompleted from "./components/features/user/MissionCompleted.jsx";
import PersonalInformation from "./components/features/user/PersonalInformation.jsx";
import PurchaseOrder from "./components/features/user/PurchaseOrder.jsx";
import { NotificationProvider } from "./components/ui/NotificationProvider";
import { AuthProvider } from "./contexts/auth.context.jsx";
import Admin from "./pages/Admin.jsx";
import AdminQueue from "./pages/AdminQueue.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";
import Customer from "./pages/Customer.jsx";
import ExchangeMarket from "./pages/ExchangeMarket.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Homepage from "./pages/Homepage.jsx";
import LoginPage from "./pages/Login.jsx";
import MissionPage from "./pages/Mission.jsx";
import RegisterPage from "./pages/Register.jsx";
import User from "./pages/User.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Homepage />,
      },
      {
        path: "missions",
        element: <MissionPage />,
      },
      {
        path: "exchange-market/*",
        element: <ExchangeMarket />,
        children: [
          { path: "redeem", element: <RedeemTab /> },
          { path: "my-items", element: <UserItemsTab /> },
          { path: "all-items", element: <AllItemsTab /> },
          { index: true, element: <Navigate to="redeem" replace /> },
        ],
      },
      {
        path: "forgot_password",
        element: <ForgotPassword />,
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <PersonalInformation /> },
          { path: "account", element: <PersonalInformation /> },
          { path: "address", element: <Address /> },
          { path: "purchase", element: <PurchaseOrder /> },
          { path: "change-password", element: <ChangePassword /> },
          { path: "delete-account", element: <DeleteAccount /> },
          { path: "missions", element: <MissionCompleted /> },
        ],
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="Admin">
            <Admin />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <UsersManagement /> },
          {
            path: "content",
            element: <ContentManagement />,
            children: [
              { path: "missions", element: <MissionsManagement /> },
              { path: "items", element: <ItemsManagement /> },
              { path: "products", element: <ProductsManagement /> },
              { path: "events", element: <EventsManagement /> },
            ],
          },
          { path: "rbac", element: <RolesPermissions /> },
          { path: "transactions", element: <TransactionsManagement /> },
          { path: "orders", element: <OrdersManagement /> },
          {
            path: "queues",
            element: <AdminQueue />,
          },
        ],
      },
      {
        path: "auth/success",
        element: <AuthCallback />,
      },
      {
        path: "customer",
        element: (
          <ProtectedRoute requiredRole={["Customer", "Admin"]}>
            <Customer />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <CustomerDashboard /> },
          { path: "profile", element: <CustomerProfile /> },
          { path: "orders", element: <CustomerOrders /> },
          { path: "scanner", element: <CustomerQRScanner /> },
          { path: "users", element: <CustomerUsers /> },
          { path: "items", element: <CustomerItems /> },
          { path: "events", element: <CustomerEvents /> },
        ],
      },
    ],
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>,
);

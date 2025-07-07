import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./app/AppLayout";
import Spinner from "./components/Spinner";
import ErrorBoundary from "./pages/ErrorBoundry";
import Login from "./pages/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./app/DashboardLayout";
import Users from "./pages/Users";
import User from "./pages/User";
import Companies from "./pages/Companies";
import Company from "./pages/Company";
import AddUserToCompany from "./pages/AddUserToCompany";
import AddCompany from "./pages/AddCompany";
import Articles from "./pages/Articles";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";

const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    loader: Spinner,
    HydrateFallback: Spinner,
    ErrorBoundary: ErrorBoundary,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: "dashboard",
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: Dashboard,
          },
          {
            path: "users",
            Component: Users,
          },
          {
            path: "users/:id",
            Component: User,
          },
          {
            path: "companies",
            Component: Companies,
          },
          {
            path: "companies/add",
            Component: AddCompany,
          },
          {
            path: "companies/:id",
            Component: Company,
          },
          {
            path: "companies/:id/add",
            Component: AddUserToCompany,
          },
          {
            path: "articles",
            Component: Articles,
          },
          {
            path: "articles/add",
            Component: AddArticle,
          },
          {
            path: "articles/:articleId",
            Component: EditArticle,
          },
          {
            path: "invoices",
            Component: Invoices,
          },
          {
            path: "invoices/create",
            Component: CreateInvoice,
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

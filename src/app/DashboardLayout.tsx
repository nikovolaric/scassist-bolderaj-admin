import { Suspense, useEffect } from "react";
import Spinner from "../components/Spinner";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/userAPI";

function DashboardLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  useEffect(
    function () {
      if (data && !data.role.includes("admin")) {
        navigate("/");
      }
      if (!pathname.startsWith("/dashboard/invoices/create")) {
        localStorage.removeItem("buyer");
        localStorage.removeItem("company");
        localStorage.removeItem("category");
      }
    },
    [pathname],
  );

  if (isPending) {
    return <Spinner />;
  }

  if (data instanceof Error) {
    return <Navigate to="/" replace />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
  );
}

export default DashboardLayout;

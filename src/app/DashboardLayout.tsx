import { Suspense } from "react";
import Spinner from "../components/Spinner";
import { Navigate, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/userAPI";

function DashboardLayout() {
  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

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

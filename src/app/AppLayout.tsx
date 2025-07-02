import { Outlet, useLocation } from "react-router";
import { Suspense, useEffect } from "react";
import Spinner from "../components/Spinner";

function AppLayout() {
  const { pathname } = useLocation();

  useEffect(
    function () {
      window.scrollTo(0, 0);
    },
    [pathname],
  );

  return (
    <Suspense fallback={<Spinner />}>
      <Outlet />
    </Suspense>
  );
}

export default AppLayout;

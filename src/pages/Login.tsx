import { useQuery } from "@tanstack/react-query";
import LoginForm from "../components/LoginForm";
import AuthLogo from "../components/AuthLogo";
import Spinner from "../components/Spinner";
import { getMe } from "../services/userAPI";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();
  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  useEffect(
    function () {
      if (!isPending && data.name !== "Error" && data.role.includes("admin")) {
        navigate("/dashboard");
      }
    },
    [isPending, data, navigate],
  );

  if (isPending) {
    return <Spinner />;
  }

  return (
    <main className="mx-auto flex flex-col gap-12 py-16 md:w-1/2 lg:my-32 lg:w-1/3">
      <div className="w-5/6">
        <AuthLogo />
      </div>
      <LoginForm />
    </main>
  );
}

export default Login;

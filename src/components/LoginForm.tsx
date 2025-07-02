import type { FormEvent } from "react";
import { useState } from "react";
import { Navigate } from "react-router";
import { loginAction } from "../services/authAPI";
import { useMutation } from "@tanstack/react-query";

function LoginForm() {
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, data } = useMutation({
    mutationFn: loginAction,
    onSuccess: (data) => {
      if (data instanceof Error) {
        throw data;
      }
    },
    onError: (error) => {
      setErr(error.message);
    },
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    mutate({ email, password });
  }

  if (data && data.status === "success" && data.user.role.includes("admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">Prijavi se v svoj admin profil</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Elektronski naslov</label>
          <input
            type="text"
            placeholder="Vnesi elektronski naslov"
            className="drop-shadow-input border-gray rounded-lg border bg-white px-3.5 py-2.5 outline-none"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Geslo</label>
          <input
            type="password"
            placeholder="Vnesi geslo"
            className="drop-shadow-input border-gray rounded-lg border bg-white px-3.5 py-2.5 outline-none"
            autoComplete="off"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="from-primary to-secondary drop-shadow-btn hover:to-primary disabled:bg-gray cursor-pointer rounded-lg bg-gradient-to-r px-4 py-3 font-semibold transition-colors duration-300 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? "..." : "Prijavi se"}
        </button>
        {err && <p className="font-medium text-red-500">{err}</p>}
      </form>
    </div>
  );
}

export default LoginForm;

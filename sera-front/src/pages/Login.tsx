import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import logo from "@/assets/images/sera-logo.svg";

import { LoginForm } from "../components/app/login/LoginForm";

export const Login = () => {
  const navigate = useNavigate();
  const isLogged = useSelector((state: any) => state.app.isPreviouslyLoggedIn);

  useEffect(() => {
    if (isLogged) {
      navigate("/dashboard");
    }
  }, [isLogged]);

  return (
    <>
      <header className="my-auto ml-6 h-[10vh] py-6">
        <img src={logo} alt={"SeRA App"} />
      </header>
      <main className="mt-auto flex h-[80vh] flex-col items-center justify-center">
        <section className="m-auto flex w-10/12 flex-col items-center justify-center rounded-xl border-2 border-sera-periwinkle p-6 text-sera-periwinkle xl:w-4/12">
          <h1 className="my-12 text-3xl font-semibold xl:text-5xl">
            Welcome back !
          </h1>
          <LoginForm />
        </section>
      </main>
    </>
  );
};

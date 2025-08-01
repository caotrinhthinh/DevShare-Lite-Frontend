import React from "react";
import LoginForm from "../components/Auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

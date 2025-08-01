import React from "react";
import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";
import RegisterForm from "../components/Auth/RegisterForm";

const RegisterPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;

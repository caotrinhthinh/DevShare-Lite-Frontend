import React from "react";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-md rounded-xl px-8 py-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Reset Your Password
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Enter your new password
        </p>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPasswordPage;

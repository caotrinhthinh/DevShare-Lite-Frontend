/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import ForgotPasswordForm from "../components/Auth/ForgotPasswordForm";
import { toast } from "react-toastify";
import { authService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [codeError, setCodeError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!code) {
      setCodeError("Please enter the code.");
      return;
    }

    try {
      setIsVerifying(true);
      setCodeError("");
      await authService.verifyResetCode(email, code);
      toast.success("Code verified!");
      navigate(`/reset-password?code=${code}`);
    } catch (error) {
      setCodeError("Invalid or expired code.");
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Email Sent!
            </h2>
            <p className="mt-2 text-gray-600">
              Please enter the reset code we just sent to your email.
            </p>

            <div className="mt-6">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  className={`input flex-1 ${
                    codeError ? "border-red-500" : ""
                  }`}
                  placeholder="Enter the code."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleVerify}
                  disabled={isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify Code"}
                </button>
              </div>
              {codeError && (
                <p className="text-sm text-red-600 mt-2 text-left">
                  {codeError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ForgotPasswordForm setSubmitted={setSubmitted} setEmail={setEmail} />
    </div>
  );
};

export default ForgotPasswordPage;

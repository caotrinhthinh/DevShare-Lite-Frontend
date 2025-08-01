/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/useAuth";

interface LoginFormProps {
  redirectTo: string;
}

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const LoginForm = ({ redirectTo }: LoginFormProps) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      navigate(redirectTo);
      console.log("Login successful, redirecting...");
    } catch (error: any) {
      const message = error?.message?.toLowerCase?.() || "";

      if (message.includes("user not found")) {
        setError("email", {
          type: "manual",
          message: "This email is not registered",
        });
      } else if (
        message.includes("password") ||
        message.includes("credentials")
      ) {
        setError("password", {
          type: "manual",
          message: "Incorrect email or password",
        });
      } else {
        toast.error("Login failed. Please try again.");
      }

      console.error("Login error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // ngăn reload
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            autoComplete="email"
            placeholder="Enter your email"
            className={`w-full px-3 py-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`w-full px-3 py-2 border rounded ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Register */}
      <p className="mt-6 text-sm text-center text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;

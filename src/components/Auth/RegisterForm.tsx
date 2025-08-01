/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "../../services/auth.service";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "all", // Validate ngay khi nhập
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      navigate("/");
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      if (message.toLowerCase().includes("email")) {
        setError("email", {
          type: "server",
          message,
        });
      } else {
        setError("name", {
          type: "server",
          message,
        });
      }
    }
  };

  const renderField = (
    name: keyof FormData,
    label: string,
    type: "text" | "email" | "password",
    toggleVisibility?: () => void,
    visible?: boolean
  ) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type === "password" ? (visible ? "text" : "password") : type}
        {...register(name)}
        className={`input w-full border rounded px-3 py-2 pr-10 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {type === "password" && toggleVisibility && (
        <span
          className="absolute top-[38px] right-3 text-gray-500 cursor-pointer"
          onClick={toggleVisibility}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      )}
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {renderField("name", "Name", "text")}
        {renderField("email", "Email", "email")}
        {renderField(
          "password",
          "Password",
          "password",
          () => setShowPassword((prev) => !prev),
          showPassword
        )}
        {renderField("confirmPassword", "Confirm Password", "password")}

        <button
          type="submit"
          className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;

import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { authService } from "../../services/auth.service";

const schema = yup.object({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const resetToken = sessionStorage.getItem("reset_token");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async ({ newPassword }: FormData) => {
    if (!resetToken) {
      toast.error("Missing token");
      return;
    }

    try {
      await authService.resetPassword(resetToken, newPassword);
      toast.success("Password has been reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to reset password");
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          type="password"
          className="input w-full"
          placeholder="New password"
          autoComplete="new-password"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="mt-1 text-sm text-red-600">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;

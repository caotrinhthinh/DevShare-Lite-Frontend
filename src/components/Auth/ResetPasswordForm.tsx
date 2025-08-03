import React from "react";
import * as yup from "yup";

const schema = yup.object({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});
type FormData = yup.InferType<typeof schema>;

const ResetPasswordForm = () => {
  return <div></div>;
};

export default ResetPasswordForm;

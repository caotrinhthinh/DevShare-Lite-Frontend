import React from "react";
import * as yup from "yup";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

type FormData = yup.InferType<typeof schema>;

const ForgotPasswordForm = () => {
  return <div></div>;
};

export default ForgotPasswordForm;

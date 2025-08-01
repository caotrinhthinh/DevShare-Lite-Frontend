import React, { useState } from "react";
import * as yup from "yup";
import type { CreatePostData } from "../../types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup.string().required("Content is required"),
  tags: yup.string().default(""),
  status: yup
    .string()
    .oneOf(["draft", "published"])
    .required("Status is required"),
});

type FormData = yup.InferType<typeof schema>;

interface PostFormProps {
  initialData?: Partial<CreatePostData>;
  onSubmit: (data: CreatePostData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const PostForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitButtonText = "Create Post",
}: PostFormProps) => {
  const [isPreview, setIsPreview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      tags: Array.isArray(initialData?.tags)
        ? initialData?.tags.join(", ")
        : initialData?.tags || "",
      status: initialData?.status || "draft",
    },
  });
  return <div>Post Form</div>;
};

export default PostForm;

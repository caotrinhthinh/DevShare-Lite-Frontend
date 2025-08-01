import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import type { CreatePostData } from "../../types";

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
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      tags: Array.isArray(initialData?.tags)
        ? initialData.tags.join(", ")
        : initialData?.tags || "",
      status: initialData?.status || "draft",
    },
  });

  const watchedContent = watch("content");
  const watchedTitle = watch("title");

  const handleFormSubmit = (data: FormData) => {
    const tagsArray = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    onSubmit({
      title: data.title,
      content: data.content,
      tags: tagsArray,
      status: data.status as "draft" | "published",
    });
  };

  const handleCancel = () => {
    const from = location.state?.from?.pathname || "/";
    navigate(from);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData ? "Edit Post" : "Create Post"}
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-4 py-2 rounded-md ${
              !isPreview
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-4 py-2 rounded-md ${
              isPreview
                ? "bg-primary-100 text-primary-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {isPreview ? (
        <div className="prose max-w-none">
          <h1 className="text-2xl">{watchedTitle}</h1>
          <ReactMarkdown>{watchedContent}</ReactMarkdown>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className={`input w-full px-4 py-2 rounded-lg border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-primary-500 focus:outline-none`}
              placeholder="Enter post title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              rows={15}
              {...register("content")}
              className={`input w-full resize-none px-4 py-2 rounded-lg border ${
                errors.content ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-primary-500 focus:outline-none`}
              placeholder="Write your post content here... (Markdown supported)"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              {...register("tags")}
              className="input w-full px-4 py-2 rounded-lg border border-gray-300"
              placeholder="e.g., javascript, react, nodejs"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="input w-full px-4 py-2 rounded-lg border border-gray-300"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? "Saving..." : submitButtonText}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostForm;

import React, { useState, type FormEvent } from "react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitButtonText?: string;
  isSubmitting?: boolean;
}
const CommentForm = ({
  onSubmit,
  onCancel,
  initialValue = "",
  placeholder = "Write a comment...",
  submitButtonText = "Post Comment",
  isSubmitting = false,
}: CommentFormProps) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit(content);
    if (!initialValue) {
      setContent("");
    }
  };

  return <div>Comment Form</div>;
};

export default CommentForm;

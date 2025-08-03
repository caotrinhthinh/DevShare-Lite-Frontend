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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-1">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="input w-full resize-none"
        required
      />

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="btn btn-primary"
        >
          {isSubmitting ? "Posting..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;

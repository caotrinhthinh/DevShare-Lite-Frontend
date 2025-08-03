import React, { useState } from "react";
import type { Comment, User } from "../../types";

interface CommentItemProps {
  comment: Comment;
  currentUser: User | null;
  onReply: (content: string) => void;
  onUpdate: (content: string) => void;
  onDelete: () => void;
}
const CommentItem = ({
  comment,
  currentUser,
  onReply,
  onUpdate,
  onDelete,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthor = currentUser && currentUser.id === comment.author._id;

  const formDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReply = async (content: string) => {
    setIsSubmitting(true);
    try {
      await onReply(content);
      setShowReplyForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hadnleUpdate = async (content: string) => {
    setIsSubmitting(true);
    try {
      await onUpdate(content);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div>Comment Item</div>;
};

export default CommentItem;

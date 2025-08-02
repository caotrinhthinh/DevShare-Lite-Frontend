/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { Comment, CreateCommentData } from "../../types";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";
import { commentsService } from "../../services/comments.service";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentAdded: () => void;
  onCommentUpdated: () => void;
  onCommentDeleted: () => void;
}
const CommentSection = ({
  postId,
  comments,
  onCommentAdded,
  onCommentDeleted,
  onCommentUpdated,
}: CommentSectionProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (data: CreateCommentData) => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      await commentsService.createComment(postId, data);
      toast.success("Comment added successfully");
      onCommentAdded();
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message || "Failed to add comment";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      await commentsService.updateComment(postId, commentId, content);
      toast.success("Comment updated successfully");
      onCommentUpdated();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await commentsService.deleteComment(postId, commentId);
      toast.success("Comment deleted successfully");
      onCommentDeleted();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div>
      <h3>Comments ({comments.length})</h3>

      {/** Add Comment Form */}
      {user ? <div></div> : <div></div>}
    </div>
  );
};

export default CommentSection;

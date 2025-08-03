/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import type { Comment } from "../../types";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";
import { commentsService } from "../../services/comments.service";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

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

  const handleAddComment = async (content: string, parentComment?: string) => {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      await commentsService.createComment(postId, { content, parentComment });
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

  const getTotalCommentCount = (comments: Comment[]) => {
    let count = 0;
    const countRecursive = (commentList: Comment[]) => {
      for (const comment of commentList) {
        count++;
        if (comment.replies?.length) {
          countRecursive(comment.replies);
        }
      }
    };
    countRecursive(comments);
    return count;
  };

  return (
    <div>
      <h3>Comments ({getTotalCommentCount(comments)})</h3>

      {/** Add Comment Form */}
      {user ? (
        <div>
          <CommentForm
            onSubmit={(content) => handleAddComment(content)}
            isSubmitting={isSubmitting}
            placeholder="Write a comment..."
          />
        </div>
      ) : (
        <div className="mb-8 text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Please login to add comments</p>
        </div>
      )}

      {/** Comments List */}
      <div>
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUser={user}
            onReply={(content) => handleAddComment(content, comment._id)}
            onUpdate={(content) => handleUpdateComment(comment._id, content)}
            onDelete={() => handleDeleteComment(comment._id)}
          />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

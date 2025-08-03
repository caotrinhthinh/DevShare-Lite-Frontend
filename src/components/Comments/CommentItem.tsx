import React, { useState } from "react";
import type { Comment, User } from "../../types";
import CommentForm from "./CommentForm";

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
  const [showReplyComment, setShowReplyComment] = useState(false);

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

  const handleUpdate = async (content: string) => {
    setIsSubmitting(true);
    try {
      await onUpdate(content);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {comment.author.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.author.name}
            </span>
            <span className="text-gray-500 text-sm">
              {formDate(comment.createdAt)}
            </span>
          </div>

          {isEditing ? (
            <CommentForm
              initialValue={comment.content}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting}
              submitButtonText="Update"
            />
          ) : (
            <>
              <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                {comment.content}
              </p>

              <div className="flex items-center space-x-4 text-sm">
                {currentUser && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Reply
                  </button>
                )}

                {isAuthor && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-600 hover:text-gray-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={onDelete}
                      className="text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}

                <span className="text-gray-500">{comment.likeCount} likes</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/** Reply Form */}
      {showReplyForm && currentUser && (
        <div className="ml-12">
          <CommentForm
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
            isSubmitting={isSubmitting}
            placeholder="Write a reply..."
            submitButtonText="Reply"
          />
        </div>
      )}

      {/** Replies */}
      {!showReplyComment && (
        <div className="ml-12 space-y-4 border-l-2 pl-4 border-gray-100">
          {comment.replies &&
            comment.replies.length > 0 &&
            (comment.replies.length === 1 ? (
              <button
                onClick={() => setShowReplyComment(true)}
                className="text-base text-gray-600 hover:text-gray-500"
              >
                Xem {comment.replies.length} phản hồi
              </button>
            ) : (
              <button>Xem tất cả {comment.replies.length} phản hồi</button>
            ))}
        </div>
      )}

      {showReplyComment && comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-4 border-l-2 pl-4 border-gray-100">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUser={currentUser}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

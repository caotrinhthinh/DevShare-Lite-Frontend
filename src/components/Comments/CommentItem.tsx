import React, { useEffect, useState } from "react";
import type { Comment, User } from "../../types";
import CommentForm from "./CommentForm";
import formDate from "../Utils/FormatDateTime";

interface CommentItemProps {
  comment: Comment;
  currentUser: User | null;
  postId: string;
  getReplies: (postId: string, commentId: string) => Promise<Comment[]>;
  onReply: (content: string, parentId?: string) => void;
  onUpdate: (content: string, commentId: string) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => Promise<void>;
}

const CommentItem = ({
  comment,
  currentUser,
  postId,
  getReplies,
  onReply,
  onUpdate,
  onDelete,
  onLike,
}: CommentItemProps) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReplyComment, setShowReplyComment] = useState(false);
  const [replies, setReplies] = useState<Comment[] | null>(null);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  const isAuthor = currentUser && currentUser.id === comment.author._id;

  useEffect(() => {
    if (currentUser) {
      setIsLiked(comment.likedBy.includes(currentUser.id));
    }
  }, [currentUser, comment.likedBy]);

  const handleReply = async (content: string) => {
    setIsSubmitting(true);
    try {
      await onReply(content, comment._id);
      setShowReplyForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (content: string) => {
    setIsSubmitting(true);
    try {
      await onUpdate(content, comment._id);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    onDelete(comment._id);
  };

  const handleShowReplies = async () => {
    if (!replies) {
      setLoadingReplies(true);
      const data = await getReplies(postId, comment._id);
      setReplies(data);
      setLoadingReplies(false);
    }
    setShowReplyComment(true);
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
                  <>
                    <button
                      onClick={() => setShowReplyForm(!showReplyForm)}
                      className="text-primary-600 hover:text-primary-500"
                    >
                      Reply
                    </button>

                    <button
                      onClick={async () => {
                        await onLike(comment._id);
                        setIsLiked(!isLiked);
                        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
                      }}
                      className={`hover:text-primary-600 ${
                        isLiked
                          ? "text-primary-600 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      Like
                    </button>
                  </>
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
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}

                <span className="text-gray-500">{likeCount} likes</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reply Form */}
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

      {/* Show replies button */}
      {!showReplyComment && comment.replies.length > 0 && (
        <div className="ml-12 border-l-2 pl-4 border-gray-100">
          <button
            onClick={handleShowReplies}
            className="text-base text-gray-600 hover:text-gray-500"
          >
            {loadingReplies
              ? "Đang tải phản hồi..."
              : `Xem ${comment.replies.length === 1 ? "" : "tất cả "} ${
                  comment.replies.length
                } phản hồi`}
          </button>
        </div>
      )}

      {/* Hide replies button */}
      {showReplyComment && (
        <div className="ml-12 border-l-2 pl-4 border-gray-100">
          <button
            onClick={() => setShowReplyComment(false)}
            className="text-base text-gray-600 hover:text-gray-500"
          >
            Ẩn phản hồi
          </button>
        </div>
      )}

      {/* Replies section */}
      {showReplyComment && replies && (
        <div className="ml-12 space-y-4 border-l-2 pl-4 border-gray-100">
          {replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUser={currentUser}
              postId={postId}
              getReplies={getReplies}
              onReply={onReply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;

import React from "react";
import { Link } from "react-router-dom";
import {
  EyeIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import type { Post } from "../../types/Post";

interface PostCardBaseProps {
  post: Post;
  showContent?: boolean;
  compact?: boolean;
}

const PostCardBase = ({
  post,
  showContent = true,
  compact = false,
}: PostCardBaseProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow ${
        compact ? "text-sm" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {post.author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900">{post.author.name}</p>
            <p className="text-sm text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        {post.status === "draft" && (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            Draft
          </span>
        )}
      </div>

      <Link to={`/posts/${post._id}`} className="block">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600">
          {post.title}
        </h3>
        {showContent && !compact && (
          <p className="text-gray-600 mb-4">{truncateContent(post.content)}</p>
        )}
      </Link>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <EyeIcon className="h-4 w-4" />
          <span>{post.viewCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <ChatBubbleLeftIcon className="h-4 w-4" />
          <span>{post.commentCount}</span>
        </div>
        <div className="flex items-center space-x-1">
          <HeartIcon className="h-4 w-4" />
          <span>{post.likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCardBase;

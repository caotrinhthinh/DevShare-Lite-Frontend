import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { Comment, Post } from "../types";
import { postsService } from "../services/posts.service";
import { toast } from "react-toastify";
import { commentsService } from "../services/comments.service";
import ReactMarkdown from "react-markdown";
import CommentSection from "../components/Comments/CommentSection";

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    if (!id) return;
    try {
      const postData = await postsService.getPost(id);
      setPost(postData);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to load post");
      navigate("/posts");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    try {
      const commentsData = await commentsService.getComments(id);
      console.log(commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error("Failed to load comments: ", error);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !window.confirm("Are you sure you want to delete this post?"))
      return;

    try {
      await postsService.deletePost(post._id);
      toast.success("Post deleted successfully");
      navigate("/posts");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user && user.id === post.author._id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Post Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{post.author.name}</h3>
              <p className="text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex space-x-2">
              <Link
                to={`/posts/${post._id}/edit`}
                className="btn btn-secondary"
              >
                Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="btn bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            {post.status === "draft" && (
              <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                Draft
              </span>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-500 pt-4 border-t">
            <span>{post.viewCount} views</span>
            <span>{post.commentCount} comments</span>
            <span>{post.likeCount} likes</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection
        postId={post._id}
        comments={comments}
        onCommentAdded={fetchComments}
        onCommentUpdated={fetchComments}
        onCommentDeleted={fetchComments}
      />
    </div>
  );
};

export default PostDetailPage;

import React, { useEffect, useState } from "react";
import type { Post } from "../types";
import { postsService } from "../services/posts.service";
import { toast } from "react-toastify";
import PostCard from "../components/Posts/PostCard";

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    try {
      const response = await postsService.getPosts(page, 5);
      if (page === 1) {
        setPosts(response.posts);
      } else {
        setPosts((prev) => [...prev, ...response.posts]);
      }
      setTotal(response.total);
      setHasMore(response.posts.length === 5);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
        <p className="text-gray-600">{total} posts total</p>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {hasMore && (
            <div>
              <button
                onClick={loadMore}
                disabled={loading}
                className="btn btn-secondary"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found</p>
        </div>
      )}
    </div>
  );
};

export default PostPage;

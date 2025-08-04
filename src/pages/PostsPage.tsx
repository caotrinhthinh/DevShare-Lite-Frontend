/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import type { Post } from "../types";
import { postsService } from "../services/posts.service";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/Utils/LoadingSpinner";
import PostStats from "../components/Posts/PostStats";
import PostCard from "../components/Posts/PostCard";
import EmptyStateSimple from "../components/Utils/EmptyStateSimple";

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setPage(1);
    try {
      const response = await postsService.searchPosts(searchQuery);
      setPosts(response.posts);
      setHasMore(false); // Search results typically don't have pagination
    } catch (error) {
      console.error("Error searching posts:", error);
      toast.error("Failed to search posts");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
    fetchPosts(1, true);
  };

  const fetchPosts = async (pageNum = page, reset = false) => {
    try {
      if (pageNum > 1) setLoadingMore(true);

      const response = await postsService.getPosts(pageNum, 5);

      if (reset || pageNum === 1) {
        setPosts(response.posts);
      } else {
        setPosts((prev) => [...prev, ...response.posts]);
      }

      setTotal(response.total);
      setHasMore(response.posts.length === 5);
    } catch (error) {
      toast.error("Failed to load posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Posts</h1>

          {/* Search Section */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="relative max-w-2xl">
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, topics, or authors..."
                  className="w-full pl-12 pr-32 py-4 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      title="Clear search"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </form>

            {searchQuery && (
              <div className="mt-4 flex items-center text-sm text-gray-600">
                <span>Search results for "</span>
                <span className="font-medium text-gray-900 mx-1">
                  {searchQuery}
                </span>
                <span>"</span>
                <button
                  onClick={clearSearch}
                  className="ml-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Show all posts
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          {!searchQuery && <PostStats total={total} loading={loading} />}
        </div>

        {/* Posts Content */}
        {posts.length > 0 ? (
          <div className="space-y-6">
            {/* Posts List */}
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && !searchQuery && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                      Load More Posts
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <EmptyStateSimple searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
};

export default PostPage;

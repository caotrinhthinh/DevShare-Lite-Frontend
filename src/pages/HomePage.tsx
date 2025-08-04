import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { postsService } from "../services/posts.service";
import type { Post } from "../types";
import { Link } from "react-router-dom";
import PostSkeleton from "../components/Utils/LoadingSkeleton";
import PostCardCompact from "../components/Posts/PostCardCompact";
import EmptyStateAdvanced from "../components/Utils/EmptyStateAdvanced";

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsService.getPosts(1, 6);
        setPosts(response.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await postsService.searchPosts(searchQuery);
      setPosts(response.posts);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setLoading(true);
    postsService
      .getPosts(1, 6)
      .then((response) => setPosts(response.posts))
      .catch((error) => console.error("Error fetching posts:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">
                DevShare Lite
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-100 leading-relaxed">
              A modern platform to share your programming knowledge, connect
              with developers, and grow together
            </p>

            {user ? (
              <Link
                to="/create-post"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Write Your Post
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <section className="mb-12">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
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
                    className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Posts Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {searchQuery ? `Search Results` : "Latest Posts"}
              </h2>
              {searchQuery && (
                <p className="text-gray-600">
                  Results for "
                  <span className="font-medium text-gray-900">
                    {searchQuery}
                  </span>
                  "
                </p>
              )}
            </div>
            <Link
              to="/posts"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 group"
            >
              View all posts
              <svg
                className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCardCompact key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyStateAdvanced
              searchQuery={searchQuery}
              user={user}
              title={searchQuery ? "No posts found" : "No posts available yet"}
              description={
                searchQuery
                  ? "Try adjusting your search terms or browse all posts"
                  : "Be the first to share your knowledge with the community"
              }
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;

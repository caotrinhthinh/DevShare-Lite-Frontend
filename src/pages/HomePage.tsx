import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postsService } from "../services/posts.service";
import { useAuth } from "../context/useAuth";
import type { Post } from "../types";
import PostCardCompact from "../components/Posts/PostCardCompact";

export const HomePage: React.FC = () => {
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

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg mb-12 shadow-md">
        <h1 className="text-4xl font-bold mb-4">Welcome to DevShare Lite</h1>
        <p className="text-xl mb-8 opacity-90">
          A place to share your programming knowledge and experience
        </p>

        {user ? (
          <Link
            to="/posts/create"
            className="btn bg-white text-primary-600 hover:bg-gray-100"
          >
            Write Your First Post
          </Link>
        ) : (
          <div className="space-x-4">
            <Link
              to="/register"
              className="btn bg-white text-primary-600 hover:bg-gray-100"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="btn border-white text-white hover:bg-white hover:text-primary-600"
            >
              Log In
            </Link>
          </div>
        )}
      </section>

      {/* Search */}
      <section className="mb-10">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Posts Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery
              ? `Search results for: "${searchQuery}"`
              : "Latest Posts"}
          </h2>
          <Link
            to="/posts"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-300 rounded mb-4" />
                <div className="h-4 bg-gray-300 rounded mb-2" />
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4" />
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-300 rounded w-16" />
                  <div className="h-6 bg-gray-300 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCardCompact key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchQuery
                ? "No posts found for your search."
                : "No posts available yet."}
            </p>
            {user && !searchQuery && (
              <Link to="/posts/create" className="btn btn-primary mt-4">
                Write Your First Post
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

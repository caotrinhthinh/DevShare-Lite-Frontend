/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { Post } from "../types/Post";
import { postsService } from "../services/posts.service";
import PostCard from "../components/Posts/PostCard";
import { useAuth } from "../context/useAuth";

const HomePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await postsService.getPosts(page, 5);
      setPosts(response.posts);
      setTotalPages(Math.ceil(response.total / 5));
      setCurrentPage(page);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }

    try {
      setLoading(true);
      const response = await postsService.searchPosts(searchQuery);
      setPosts(response.posts);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-white rounded-lg shadow-md border p-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          🚀 Welcome to <span className="text-primary-600">DevShare Lite</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          DevShare Lite is a collaborative forum where developers from all
          levels come together to share knowledge, ask questions, and grow their
          careers.
        </p>

        {!user ? (
          <div className="flex flex-col items-center gap-3 mt-6">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg px-8 py-3 rounded-lg transition shadow"
            >
              🚀 Join the Community
            </Link>

            <Link
              to="/create-post"
              className="text-primary-600 hover:text-primary-700 font-medium text-base *: px-6 py-3 rounded-lg transition"
            >
              ✍️ Create a post
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 mt-6">
            <p className="text-lg text-gray-800">
              👋 Welcome back,{" "}
              <span className="font-semibold">{user.name}</span>!
            </p>
            <p className="text-sm text-gray-500">
              Ready to explore or contribute some knowledge today?
            </p>
          </div>
        )}
      </section>

      {/* Search Section */}
      <section className="bg-white rounded-lg shadow-md border p-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search posts, tags, or authors..."
            className="input w-full md:flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition"
          >
            Search
          </button>
        </form>
      </section>

      {/* Posts */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
          <Link to="/posts" className="text-primary-600 hover:text-primary-500">
            View all posts →
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found</p>
            {searchQuery && (
              <button
                onClick={() => fetchPosts(currentPage)}
                className="mt-4 text-primary-600 hover:text-primary-500"
              >
                Show all posts
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 py-6">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchPosts(currentPage - 1)}
              className={`btn btn-outline px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchPosts(currentPage + 1)}
              className={`btn btn-outline px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

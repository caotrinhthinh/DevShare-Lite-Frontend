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
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to DevShare Lite
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          A community forum for developers to share knowledge and discuss
          technical topics
        </p>

        {!user ? (
          <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
            Join the Community
          </Link>
        ) : (
          <div className="flex justify-center items-center flex-col gap-3">
            <p className="text-lg text-gray-800">
              👋 Welcome back,{" "}
              <span className="font-semibold">{user.name}</span>!
            </p>
            <Link to="/posts/create" className="btn btn-outline text-lg">
              + Create New Post
            </Link>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
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
        </form>
      </div>

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

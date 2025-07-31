import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { Post } from "../types/Post";
import { postsService } from "../services/posts.service";
import PostCard from "../components/Posts/PostCard";

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postsService.getPosts(1, 10);
      setPosts(response.posts);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
          Join the Community
        </Link>
      </div>

      {/* Search */}
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
                onClick={fetchPosts}
                className="mt-4 text-primary-600 hover:text-primary-500"
              >
                Show all posts
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

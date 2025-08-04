import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import type { Post } from "../types";
import { postsService } from "../services/posts.service";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"published" | "draft">(
    "published"
  );

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsService.deletePost(postId);
        setPosts(posts.filter((post) => post._id !== postId));
        toast.success("Post deleted successfully");
      } catch (error) {
        toast.error("Can't delete post");
      }
    }
  };

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const myPosts = await postsService.getMyPosts();
        setPosts(myPosts);
      } catch (error) {
        toast.error("Unable to load posts");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const publishedPosts = posts.filter((post) => post.status === "published");
  const draftPosts = posts.filter((post) => post.status === "draft");

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please login to view profile</p>
        <Link to="/login" className="btn btn-primary mt-4 inline-block">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/** Profile Header */}
      <div>
        <div>
          <div>
            <span>{user?.name.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/Posts/PostForm";
import type { CreatePostData } from "../types";
import { postsService } from "../services/posts.service";
import { toast } from "react-toastify";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (data: CreatePostData) => {
    try {
      setIsLoading(true);
      const post = await postsService.createPost(data);
      toast.success("Post created successfully!");
      navigate(`/posts/${post._id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        toast.error(err.response?.data?.message || "Failed to create post");
      } else {
        toast.error("Failed to create post");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PostForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Create Post"
      />
    </div>
  );
};

export default CreatePostPage;

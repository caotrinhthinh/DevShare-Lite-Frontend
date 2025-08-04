import PostCardBase from "./PostCardBase";
import type { Post } from "../../types/Post";

const PostCard = ({ post }: { post: Post }) => {
  return <PostCardBase post={post} showContent />;
};

export default PostCard;

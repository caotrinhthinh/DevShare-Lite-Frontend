import PostCardBase from "./PostCardBase";
import type { Post } from "../../types/Post";

const PostCardCompact = ({ post }: { post: Post }) => {
  return <PostCardBase post={post} showContent={false} compact />;
};

export default PostCardCompact;

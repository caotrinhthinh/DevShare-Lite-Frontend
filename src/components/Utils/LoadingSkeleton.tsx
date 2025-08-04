const PostSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse hover:shadow-md transition-shadow duration-300">
    <div className="h-5 bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded-lg mb-3" />
    <div className="h-4 bg-gray-200 rounded-lg mb-4 w-3/4" />
    <div className="flex space-x-3">
      <div className="h-6 bg-gray-200 rounded-full w-16" />
      <div className="h-6 bg-gray-200 rounded-full w-20" />
    </div>
  </div>
);

export default PostSkeleton;

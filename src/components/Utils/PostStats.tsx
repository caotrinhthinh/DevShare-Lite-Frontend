const PostStats = ({ total, loading }: { total: number; loading: boolean }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Community Posts
        </h3>
        <p className="text-gray-600">
          {loading ? (
            <span className="inline-block w-16 h-4 bg-gray-200 rounded animate-pulse"></span>
          ) : (
            `${total.toLocaleString()} ${
              total === 1 ? "post" : "posts"
            } shared by our community`
          )}
        </p>
      </div>
      <div className="flex items-center space-x-2 text-primary-600">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
    </div>
  </div>
);

export default PostStats;

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-64">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
    </div>
  </div>
);

export default LoadingSpinner;

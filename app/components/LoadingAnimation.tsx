'use client';

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center space-x-2 animate-pulse">
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      <span className="text-gray-500 text-sm">Analyzing your CV...</span>
    </div>
  );
}

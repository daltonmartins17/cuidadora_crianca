import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
        <p className="text-center mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
};

export default Loading;

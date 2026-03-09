const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center px-6 max-w-2xl">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 blur-2xl opacity-50">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
              404
            </h1>
          </div>
        </div>

        {/* Message */}
        <div className="mt-8 space-y-4">
          <h2 className="text-3xl font-bold text-white">Oops! Lost in Space</h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto">
            The page you're looking for has drifted into the void. Let's get you
            back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/50"
          >
            Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-200"
          >
            Home Page
          </button>
        </div>

        {/* Floating Elements */}
        <div className="mt-16 flex justify-center gap-8 opacity-60">
          <div
            className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

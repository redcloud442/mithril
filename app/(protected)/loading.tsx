const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-950 via-zinc-900 to-orange-900 z-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-orange-500/30 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-red-500/40 rounded-full animate-spin [animation-direction:reverse]"></div>

            {/* Logo container */}
            <div className="absolute inset-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center animate-pulse">
              {/* Trading Chart Icon */}
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h2v8H3v-8zm4-6h2v14H7V7zm4-6h2v20h-2V1zm4 8h2v12h-2V9zm4-4h2v16h-2V5z" />
              </svg>
            </div>
          </div>

          {/* Pulsing glow effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full animate-ping"></div>
        </div>

        {/* Loading text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Initializing</h2>

          <div className="flex items-center justify-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0ms]"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:150ms]"></div>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:300ms]"></div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-zinc-700 rounded-full overflow-hidden mx-auto">
            <div className="h-full w-full bg-gradient-to-r from-orange-500 to-red-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

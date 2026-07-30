import React from 'react';

export const ToothCanvas: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        <div
          className="rounded-full overflow-hidden animate-spin-slow"
          style={{
            width: 200,
            height: 200,
            animation: 'spin 12s linear infinite, bob 3s ease-in-out infinite',
            boxShadow: '0 0 40px rgba(59,130,246,0.15), 0 0 80px rgba(59,130,246,0.08)'
          }}
        >
          <img
            src="/tooth-model.png"
            alt="3D Tooth Model"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium text-slate-700 border border-slate-200/80 shadow-sm pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Interactive 3D Teeth
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bob {
          0%, 100% { translate: 0 0px; }
          50% { translate: 0 -10px; }
        }
      `}</style>
    </div>
  );
};
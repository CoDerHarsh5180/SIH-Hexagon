import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full border border-border rounded-2xl bg-background p-8 text-center space-y-4 shadow-sm">
        <span className="text-4xl font-mono font-bold text-india-blue block">404</span>
        <h1 className="text-xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-xs text-foreground/70 leading-relaxed">
          The requested clearance page, portal docket, or URL does not exist or has been relocated.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-border hover:bg-border transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/user/dashboard')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-india-blue text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>User Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

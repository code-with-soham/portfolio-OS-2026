import React from 'react';
import { ServerCrash, RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MongoDB Explorer Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // In a real app, might want to also trigger a re-fetch or clear cache
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] text-gray-200 p-8 font-sans">
          <div className="bg-[#2D2D2D] border border-red-900 rounded-lg p-8 max-w-md w-full text-center shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center mb-6">
              <ServerCrash size={32} className="text-red-500" />
            </div>
            
            <h2 className="text-xl font-bold text-red-400 mb-2">🔴 Database Offline</h2>
            <p className="text-sm text-gray-400 mb-6">
              We lost connection to MongoDB Atlas. Please check your network or verify the cluster status.
            </p>

            <div className="w-full bg-[#1E1E1E] p-3 rounded text-left mb-6 overflow-hidden">
              <p className="text-xs text-red-300 font-mono break-words">
                {this.state.error?.message || "Unknown Connection Error"}
              </p>
            </div>

            <div className="flex space-x-4 w-full">
              <button 
                onClick={this.handleRetry}
                className="flex-1 flex justify-center items-center py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                <RefreshCw size={16} className="mr-2" /> Retry
              </button>
              <button 
                className="flex-1 flex justify-center items-center py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 rounded-md transition-colors"
              >
                <AlertTriangle size={16} className="mr-2" /> Check Connection
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

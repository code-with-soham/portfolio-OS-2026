import React from 'react';
import { Database, Server } from 'lucide-react';
import { useMongoStore } from '../hooks/useMongoStore';

const WelcomeScreen = () => {
  const { currentDatabase } = useMongoStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-bg-primary)] p-8">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        
        <div className="w-24 h-24 bg-green-500 bg-opacity-10 rounded-full flex items-center justify-center mb-4">
          <img src="/src/assets/icons/apps/mongodb.svg" alt="MongoDB" className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-bold text-gray-100">
          MongoDB Atlas Explorer
        </h1>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-6 w-full shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <span className="text-gray-400 text-sm">Connected to</span>
              <div className="flex items-center text-gray-200 font-medium">
                <Server size={16} className="mr-2 text-green-500" />
                Cluster0
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Database</span>
              <div className="flex items-center text-gray-200 font-medium">
                <Database size={16} className="mr-2 text-yellow-500" />
                {currentDatabase}
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-500 mt-8">
          Select a collection from the left panel to begin.
        </p>

      </div>
    </div>
  );
};

export default WelcomeScreen;

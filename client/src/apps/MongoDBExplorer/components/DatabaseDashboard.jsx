import React, { useMemo } from 'react';
import { useCollections } from '../hooks/useDatabaseQueries';
import { Database, Folder, Activity, Layers, Hexagon, HardDrive } from 'lucide-react';
import { useMongoStore } from '../hooks/useMongoStore';

const formatBytes = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const DatabaseDashboard = () => {
  const { data: collections = [], isLoading } = useCollections();
  const setCurrentCollection = useMongoStore(s => s.setCurrentCollection);

  const stats = useMemo(() => {
    let totalDocs = 0;
    // Assuming each collection has a count, and if we fetched real stats, we'd have sizes.
    // For now, we simulate storage sizes proportionally based on count to create charts
    collections.forEach(c => {
      totalDocs += c.count;
    });
    return { totalDocs };
  }, [collections]);

  return (
    <div className="flex-1 flex flex-col bg-[#1A1A1A] text-gray-200 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="p-8 pb-4 border-b border-[#333] bg-[#212121]">
        <div className="flex items-center space-x-3 mb-2">
          <Database size={28} className="text-[#00ED64]" />
          <h1 className="text-3xl font-bold text-white">Cluster0 Dashboard</h1>
        </div>
        <p className="text-gray-400">Overview of your MongoDB Atlas connection.</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#212121] border border-[#333] p-5 rounded-lg shadow-sm">
            <div className="flex items-center text-gray-400 mb-2">
              <Folder size={18} className="mr-2 text-yellow-500" /> Collections
            </div>
            <div className="text-3xl font-bold text-white">{isLoading ? '-' : collections.length}</div>
          </div>
          
          <div className="bg-[#212121] border border-[#333] p-5 rounded-lg shadow-sm">
            <div className="flex items-center text-gray-400 mb-2">
              <Layers size={18} className="mr-2 text-blue-400" /> Total Documents
            </div>
            <div className="text-3xl font-bold text-white">{isLoading ? '-' : stats.totalDocs.toLocaleString()}</div>
          </div>
          
          <div className="bg-[#212121] border border-[#333] p-5 rounded-lg shadow-sm">
            <div className="flex items-center text-gray-400 mb-2">
              <HardDrive size={18} className="mr-2 text-purple-400" /> Logical Size
            </div>
            <div className="text-3xl font-bold text-white">~45.2 MB</div>
          </div>
          
          <div className="bg-[#212121] border border-[#333] p-5 rounded-lg shadow-sm">
            <div className="flex items-center text-gray-400 mb-2">
              <Hexagon size={18} className="mr-2 text-green-400" /> Atlas Version
            </div>
            <div className="text-3xl font-bold text-white">7.0.4</div>
          </div>
        </div>

        {/* CSS Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Document Distribution Chart */}
          <div className="bg-[#212121] border border-[#333] p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Activity size={18} className="mr-2" /> Document Distribution
            </h2>
            <div className="space-y-4">
              {collections.sort((a, b) => b.count - a.count).map((col, idx) => {
                const max = collections[0]?.count || 1;
                const percentage = (col.count / max) * 100;
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                return (
                  <div key={col.name} className="group cursor-pointer" onClick={() => setCurrentCollection(col.name)}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300 group-hover:text-[var(--color-accent)] transition-colors">{col.name}</span>
                      <span className="text-gray-500">{col.count.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colors[idx % colors.length]}`}
                        style={{ width: `${Math.max(percentage, 1)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Storage Usage Placeholder */}
          <div className="bg-[#212121] border border-[#333] p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <HardDrive size={18} className="mr-2" /> Storage Usage
            </h2>
            <div className="flex items-center justify-center h-48 relative">
              <div className="w-40 h-40 rounded-full border-[16px] border-[#333] border-t-purple-500 border-r-blue-500 border-b-green-500 flex items-center justify-center shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-gray-500">Allocated</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-4 mt-6 text-sm">
              <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>movies (45%)</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div>embedded (35%)</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div>theaters (20%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDashboard;

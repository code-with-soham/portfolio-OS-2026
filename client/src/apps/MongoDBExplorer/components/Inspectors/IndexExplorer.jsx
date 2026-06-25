import React from 'react';
import { useCollectionIndexes } from '../../hooks/useDatabaseQueries';
import { Key, AlertCircle, Check } from 'lucide-react';

const IndexExplorer = ({ currentCollection }) => {
  const { data: indexes, isLoading, isError } = useCollectionIndexes(currentCollection);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1A1A1A]">
        <div className="loading-spinner w-8 h-8 border-4 border-gray-600 border-t-[var(--color-accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !indexes) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1A1A1A] text-red-400">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <p>Failed to load indexes.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1A1A1A] overflow-hidden">
      <div className="p-4 border-b border-[#333] bg-[#212121]">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center">
          <Key size={18} className="mr-2 text-yellow-500" />
          Indexes for `{currentCollection}`
        </h2>
        <p className="text-xs text-gray-500 mt-1">Indexes support the efficient execution of queries in MongoDB.</p>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        <table className="w-full text-left text-sm text-gray-300 bg-[#1E1E1E] rounded-md border border-[#333]">
          <thead className="bg-[#2D2D2D] text-xs uppercase font-semibold text-gray-400 border-b border-[#444]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Fields</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Unique</th>
              <th className="px-4 py-3">Size</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333] font-mono">
            {indexes.map((idx) => (
              <tr key={idx.name} className="hover:bg-[#2A2A2A] transition-colors">
                <td className="px-4 py-3 text-gray-200 font-semibold">{idx.name}</td>
                <td className="px-4 py-3 text-blue-300">{idx.fields}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs border ${idx.type === 'regular' ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-indigo-900/30 border-indigo-700 text-indigo-300'}`}>
                    {idx.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {idx.unique ? <Check size={16} className="text-green-500" /> : 'No'}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {idx.size}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndexExplorer;

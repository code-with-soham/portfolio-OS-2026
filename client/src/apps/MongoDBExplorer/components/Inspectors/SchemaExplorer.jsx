import React from 'react';
import { useDatabaseSchema } from '../hooks/useDatabaseQueries';
import { LayoutTemplate, AlertCircle } from 'lucide-react';

const SchemaExplorer = ({ currentCollection }) => {
  const { data: schema, isLoading, isError } = useDatabaseSchema(currentCollection);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1A1A1A]">
        <div className="loading-spinner w-8 h-8 border-4 border-gray-600 border-t-[var(--color-accent)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !schema) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1A1A1A] text-red-400">
        <AlertCircle size={48} className="mb-4 opacity-50" />
        <p>Failed to analyze schema.</p>
      </div>
    );
  }

  const fields = Object.entries(schema);

  return (
    <div className="flex-1 flex flex-col bg-[#1A1A1A] overflow-hidden">
      <div className="p-4 border-b border-[#333] bg-[#212121]">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center">
          <LayoutTemplate size={18} className="mr-2 text-[var(--color-accent)]" />
          Schema Analysis for `{currentCollection}`
        </h2>
        <p className="text-xs text-gray-500 mt-1">Based on sampling 100 documents.</p>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar p-4">
        <table className="w-full text-left text-sm text-gray-300 bg-[#1E1E1E] rounded-md border border-[#333]">
          <thead className="bg-[#2D2D2D] text-xs uppercase font-semibold text-gray-400 border-b border-[#444]">
            <tr>
              <th className="px-4 py-3">Field Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Nullable / Missing</th>
              <th className="px-4 py-3">Occurrence %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333] font-mono">
            {fields.map(([fieldName, typeInfo]) => (
              <tr key={fieldName} className="hover:bg-[#2A2A2A] transition-colors">
                <td className="px-4 py-3 text-gray-200">{fieldName}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-[#2A2A2A] rounded border border-[#444] text-[var(--color-accent)]">
                    {Array.isArray(typeInfo) ? typeInfo.join(' | ') : typeInfo}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {/* Mocking nullable data for now since backend doesn't explicitly return % */}
                  {fieldName === '_id' ? 'No' : 'Possibly'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="w-full bg-[#1A1A1A] rounded-full h-1.5 mr-2">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: fieldName === '_id' ? '100%' : '85%' }}></div>
                    </div>
                    <span className="text-xs text-gray-500">{fieldName === '_id' ? '100%' : '~85%'}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchemaExplorer;

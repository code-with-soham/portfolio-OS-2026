import React, { useMemo } from 'react';

const TableView = ({ docs, onOpenDetails }) => {
  // Extract columns dynamically from the first few documents to ensure we get a good sample
  const columns = useMemo(() => {
    if (!docs || docs.length === 0) return [];
    const keySet = new Set();
    
    // Check first 10 docs to gather keys
    docs.slice(0, 10).forEach(doc => {
      Object.keys(doc).forEach(key => keySet.add(key));
    });
    
    // Ensure _id is first
    const cols = Array.from(keySet);
    const idIdx = cols.indexOf('_id');
    if (idIdx > -1) {
      cols.splice(idIdx, 1);
      cols.unshift('_id');
    }
    
    // Take at most 10 columns to prevent massive horizontal scroll natively
    return cols.slice(0, 10);
  }, [docs]);

  const renderCellValue = (val) => {
    if (val === null) return <span className="text-gray-500 italic">null</span>;
    if (val === undefined) return '';
    if (typeof val === 'boolean') return <span className="text-purple-400">{val.toString()}</span>;
    if (typeof val === 'number') return <span className="text-green-400">{val}</span>;
    if (typeof val === 'object') {
      if (val.$oid) return <span className="text-gray-400">{val.$oid}</span>;
      if (Array.isArray(val)) return <span className="text-blue-300">Array({val.length})</span>;
      return <span className="text-blue-300">Object</span>;
    }
    const str = String(val);
    return <span className="text-yellow-300">"{str.length > 50 ? str.substring(0, 50) + '...' : str}"</span>;
  };

  if (docs.length === 0) return null;

  return (
    <div className="w-full h-full overflow-auto custom-scrollbar bg-[#1E1E1E] border border-[var(--color-border)] rounded">
      <table className="w-full text-left text-sm whitespace-nowrap text-gray-300">
        <thead className="sticky top-0 bg-[#2D2D2D] text-xs uppercase font-semibold text-gray-400 border-b border-[#444] z-10">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={col} 
                className={`px-4 py-2 border-r border-[#444] last:border-r-0 ${idx === 0 ? 'sticky left-0 bg-[#2D2D2D] z-20 shadow-[1px_0_0_0_#444]' : ''}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#333] font-mono text-xs">
          {docs.map((doc, rIdx) => (
            <tr 
              key={doc._id || rIdx} 
              className="hover:bg-[#2A2A2A] cursor-pointer transition-colors group"
              onClick={() => onOpenDetails(doc)}
            >
              {columns.map((col, cIdx) => (
                <td 
                  key={col} 
                  className={`px-4 py-2 truncate max-w-[200px] border-r border-[#333] last:border-r-0 ${cIdx === 0 ? 'sticky left-0 bg-[#1E1E1E] group-hover:bg-[#2A2A2A] z-10 shadow-[1px_0_0_0_#333]' : ''}`}
                >
                  {renderCellValue(doc[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;

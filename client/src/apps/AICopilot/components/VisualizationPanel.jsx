import React, { useState } from 'react';
import { BarChart, PieChart, Table as TableIcon, Code, AlertCircle } from 'lucide-react';
import TableView from '../../MongoDBExplorer/components/Views/TableView';
import JsonView from '../../MongoDBExplorer/components/Views/JsonView';

const VisualizationPanel = ({ result, error, activePlan }) => {
  const [viewMode, setViewMode] = useState('table'); // 'table', 'json', 'chart'

  if (error) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#1E1E1E] p-4 text-red-400 font-mono text-sm overflow-auto">
        <div className="flex items-center mb-2">
          <AlertCircle size={16} className="mr-2" />
          <span className="font-semibold">Execution Error</span>
        </div>
        <div className="bg-[#2a1a1a] p-3 rounded border border-red-900/50">
          {error?.response?.data?.error || error?.message || 'Unknown execution error'}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[#1A1A1A] p-4 text-gray-500 font-mono text-sm items-center justify-center border-t border-[#333]">
        <BarChart size={48} className="mb-4 opacity-20" />
        <p>Awaiting execution...</p>
      </div>
    );
  }

  const { data, executionTimeMs, rows } = result;
  const normalizedData = Array.isArray(data) ? data : (data !== undefined && data !== null ? [data] : []);

  // Check if we should suggest a chart
  const hasChartSuggestion = activePlan?.chart && activePlan.chart.type !== 'none';
  const showChart = viewMode === 'chart' && hasChartSuggestion;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#1A1A1A] border-t border-[#333]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#212121] border-b border-[#333] text-xs">
        <div className="flex items-center space-x-4 text-gray-400 font-mono">
          <span>Execution: <span className="text-white">{executionTimeMs}ms</span></span>
          <span>Rows: <span className="text-white">{rows}</span></span>
        </div>

        <div className="flex bg-[#1E1E1E] rounded-md border border-gray-600 overflow-hidden">
          {hasChartSuggestion && (
            <button 
              onClick={() => setViewMode('chart')}
              className={`p-1.5 transition-colors ${viewMode === 'chart' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-[#2A2D2E]'}`}
              title="Chart View"
            ><BarChart size={14} /></button>
          )}
          <button 
            onClick={() => setViewMode('table')}
            className={`p-1.5 transition-colors ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-[#2A2D2E]'}`}
            title="Table View"
          ><TableIcon size={14} /></button>
          <button 
            onClick={() => setViewMode('json')}
            className={`p-1.5 transition-colors ${viewMode === 'json' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-[#2A2D2E]'}`}
            title="JSON View"
          ><Code size={14} /></button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-[#1E1E1E]">
        {normalizedData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono">
            Output is empty.
          </div>
        ) : (
          <>
            {viewMode === 'table' && <TableView docs={normalizedData} onOpenDetails={() => {}} />}
            {viewMode === 'json' && <JsonView docs={normalizedData} />}
            {showChart && (
              <div className="absolute inset-0 p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-center mb-6 text-gray-200">{activePlan.chart.title}</h3>
                <div className="flex-1 flex items-end justify-center space-x-4 pb-10">
                  {/* Super basic CSS chart for demonstration */}
                  {normalizedData.slice(0, 10).map((d, i) => {
                    // Try to guess value field for height
                    const val = d.count || d.value || d.total || Object.values(d).find(v => typeof v === 'number');
                    const label = d._id || d.name || d.title || `Item ${i}`;
                    const height = typeof val === 'number' ? Math.min(val * 10, 100) : 50; // Naive scaling
                    
                    return (
                      <div key={i} className="flex flex-col items-center group relative">
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none z-10">
                          {label}: {val}
                        </div>
                        <div 
                          className="w-16 bg-purple-500 hover:bg-purple-400 transition-colors rounded-t-sm" 
                          style={{ height: `${Math.max(height, 5)}%`, minHeight: '20px' }}
                        ></div>
                        <span className="text-[10px] text-gray-400 mt-2 truncate w-16 text-center" title={String(label)}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VisualizationPanel;

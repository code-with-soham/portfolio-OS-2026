import React, { useState } from 'react';
import { Plus, Trash2, Filter } from 'lucide-react';

const QueryBuilder = ({ onApplyQuery, onClose }) => {
  const [conditions, setConditions] = useState([
    { field: 'year', operator: '$gt', value: '2015' }
  ]);

  const addCondition = () => {
    setConditions([...conditions, { field: 'year', operator: '$eq', value: '' }]);
  };

  const removeCondition = (index) => {
    const newConds = [...conditions];
    newConds.splice(index, 1);
    setConditions(newConds);
  };

  const updateCondition = (index, key, val) => {
    const newConds = [...conditions];
    newConds[index][key] = val;
    setConditions(newConds);
  };

  const handleApply = () => {
    const queryObj = {};
    conditions.forEach(cond => {
      if (!cond.field || cond.value === '') return;
      
      let val = cond.value;
      // Try to parse number
      if (!isNaN(val) && val.trim() !== '') {
        val = Number(val);
      }
      
      if (cond.operator === '$eq') {
        queryObj[cond.field] = val;
      } else {
        if (!queryObj[cond.field]) queryObj[cond.field] = {};
        queryObj[cond.field][cond.operator] = val;
      }
    });
    
    onApplyQuery(JSON.stringify(queryObj, null, 2));
  };

  return (
    <div className="bg-[#1E1E1E] border-b border-[var(--color-border)] p-4 shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center">
          <Filter size={16} className="mr-2 text-indigo-400" />
          Visual Query Builder
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-xs">Close</button>
      </div>

      <div className="space-y-3 mb-4">
        {conditions.map((cond, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-sm">
            <input 
              type="text" 
              placeholder="Field (e.g. year)"
              value={cond.field}
              onChange={(e) => updateCondition(idx, 'field', e.target.value)}
              className="bg-[#2D2D2D] border border-gray-600 text-gray-200 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none w-40 flex-shrink-0"
            />
            
            <select 
              value={cond.operator}
              onChange={(e) => updateCondition(idx, 'operator', e.target.value)}
              className="bg-[#2D2D2D] border border-gray-600 text-gray-200 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none flex-shrink-0"
            >
              <option value="$eq">== (equals)</option>
              <option value="$ne">!= (not equals)</option>
              <option value="$gt">&gt; (greater than)</option>
              <option value="$gte">&gt;= (greater or equal)</option>
              <option value="$lt">&lt; (less than)</option>
              <option value="$lte">&lt;= (less or equal)</option>
              <option value="$regex">contains (regex)</option>
            </select>
            
            <input 
              type="text" 
              placeholder="Value"
              value={cond.value}
              onChange={(e) => updateCondition(idx, 'value', e.target.value)}
              className="bg-[#2D2D2D] border border-gray-600 text-gray-200 rounded px-3 py-1.5 focus:border-indigo-500 focus:outline-none flex-1"
            />
            
            <button 
              onClick={() => removeCondition(idx)}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-[#2A2A2A] rounded transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={addCondition}
          className="flex items-center px-3 py-1.5 bg-[#2D2D2D] hover:bg-[#333] text-gray-300 text-xs font-medium rounded border border-gray-600 transition-colors"
        >
          <Plus size={14} className="mr-1" /> Add Condition
        </button>
        <button 
          onClick={handleApply}
          className="flex items-center px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded border border-green-500 transition-colors shadow-sm"
        >
          Apply Query
        </button>
      </div>
    </div>
  );
};

export default QueryBuilder;

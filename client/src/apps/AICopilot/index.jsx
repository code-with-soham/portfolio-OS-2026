import React, { useState } from 'react';
import CopilotConversation from './components/CopilotConversation';
import GeneratedQueryPanel from './components/GeneratedQueryPanel';
import VisualizationPanel from './components/VisualizationPanel';

const AICopilotApp = () => {
  const [executionResult, setExecutionResult] = useState(null);
  const [executionError, setExecutionError] = useState(null);

  return (
    <div className="h-full w-full flex flex-row overflow-hidden bg-[#1E1E1E] text-white">
      {/* Left Pane: Conversation */}
      <div className="w-[350px] min-w-[300px] max-w-[500px] h-full flex flex-col z-10 shadow-xl">
        <CopilotConversation />
      </div>

      {/* Right Pane: Split Vertically (Query & Output) */}
      <div className="flex-1 flex flex-col min-w-0">
        <GeneratedQueryPanel 
          setExecutionResult={setExecutionResult}
          setExecutionError={setExecutionError}
        />
        
        <VisualizationPanel 
          result={executionResult} 
          error={executionError} 
        />
      </div>
    </div>
  );
};

export default AICopilotApp;

import { DataPieRegular, CheckmarkCircleRegular } from '@fluentui/react-icons';

export default function StatusBar({ totalItems, selectedCount }) {
  return (
    <div className="explorer-status-bar">
      <div className="status-left">
        <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        <div className="status-divider" />
        {selectedCount > 0 && (
          <span>{selectedCount} item{selectedCount !== 1 ? 's' : ''} selected</span>
        )}
      </div>
      
      <div className="status-right">
        <span className="status-sync">
          <CheckmarkCircleRegular fontSize={14} color="#2ECC71" /> Sync Complete
        </span>
        <div className="status-divider" />
        <span className="status-storage">
          <DataPieRegular fontSize={14} /> Storage 68%
        </span>
      </div>
    </div>
  );
}

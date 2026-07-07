import { CheckmarkCircleRegular, InfoRegular, PresenceAvailableRegular } from '@fluentui/react-icons';

export default function AboutStatusBar() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return (
    <div className="about-status-bar">
      <div className="status-left">
        <span className="status-item"><InfoRegular fontSize={14} /> Last Updated: {lastUpdated}</span>
      </div>
      <div className="status-right">
        <span className="status-item"><CheckmarkCircleRegular fontSize={14} color="#0078d4" /> Portfolio Health: 92%</span>
        <div className="status-divider" />
        <span className="status-item"><PresenceAvailableRegular fontSize={14} color="#2ECC71" /> Online</span>
      </div>
    </div>
  );
}

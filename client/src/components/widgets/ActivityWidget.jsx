import { useAchievementStore } from '../../store/useAchievementStore';
import { HistoryRegular } from '@fluentui/react-icons';

export default function ActivityWidget() {
  const activityLog = useAchievementStore((s) => s.activityLog);

  return (
    <div
      className="glass-heavy"
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-panel)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <HistoryRegular style={{ fontSize: '18px', color: 'var(--color-accent)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Recent Activity</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {activityLog && activityLog.length > 0 ? (
          activityLog.map((activity) => {
            const timeStr = new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem' }}>{activity.label}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{timeStr}</span>
              </div>
            );
          })
        ) : (
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
            No recent activity
          </span>
        )}
      </div>
    </div>
  );
}

import {
  TrophyRegular,
  DesktopRegular,
  SettingsRegular,
  ArrowDownloadRegular,
  SparkleRegular,
  DismissRegular,
  AlertRegular,
} from '@fluentui/react-icons';

const CATEGORY_ICONS = {
  achievement: TrophyRegular,
  system: DesktopRegular,
  settings: SettingsRegular,
  download: ArrowDownloadRegular,
  ai: SparkleRegular,
};

/**
 * Helper to format timestamp like "[10:21 PM]"
 */
function formatTime(timestamp) {
  const d = new Date(timestamp);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `[${hours}:${minutes} ${ampm}]`;
}

/**
 * Notification Card Component
 */
export default function NotificationCard({ notif, onDismiss, onAction }) {
  const IconComponent = CATEGORY_ICONS[notif.category] || AlertRegular;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '12px',
        background: notif.read ? 'var(--color-bg-surface)' : 'var(--color-bg-surface-hover)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid',
        borderColor: notif.read ? 'var(--color-border)' : 'var(--color-border-active)',
        position: 'relative',
        transition: 'all var(--transition-fast)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            color: 'var(--color-text-primary)',
          }}
        >
          <IconComponent fontSize={20} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-family)' }}>
              {notif.title}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-family)' }}>
              {formatTime(notif.timestamp)}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, fontFamily: 'var(--font-family)' }}>
            {notif.message}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss(notif.id);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-tertiary)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
          }}
          title="Dismiss"
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
        >
          <DismissRegular fontSize={14} />
        </button>
      </div>

      {/* Action Button */}
      {notif.actionLabel && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button
            onClick={() => {
              if (notif.action) notif.action();
              if (onAction) onAction(notif);
            }}
            style={{
              background: 'var(--color-bg-surface-active)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-button)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-bg-surface-active)')}
          >
            {notif.actionLabel}
          </button>
        </div>
      )}
    </div>
  );
}

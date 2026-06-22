import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

export default function MobileStatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mobile-status-bar">
      <div className="status-left">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="status-right" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <Icon icon="mdi:signal" style={{ fontSize: '14px' }} />
        <Icon icon="mdi:wifi" style={{ fontSize: '14px' }} />
        <Icon icon="mdi:battery" style={{ fontSize: '16px' }} />
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Wifi4Regular, Battery5Regular } from '@fluentui/react-icons';

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
        <Wifi4Regular fontSize={14} />
        <Battery5Regular fontSize={16} />
      </div>
    </div>
  );
}

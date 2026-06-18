import { useEffect } from 'react';
import { useBackgroundServiceStore } from '../../store/useBackgroundServiceStore';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useNotificationStore } from '../../store/useNotificationStore';

export default function BackgroundServices() {
  const services = useBackgroundServiceStore(s => s.services);
  const calendarEvents = useCalendarStore(s => s.events);
  const addNotification = useNotificationStore(s => s.addNotification);

  // Calendar Reminder Service
  useEffect(() => {
    const calendarService = services.find(s => s.id === 'calendar');
    if (!calendarService || calendarService.status !== 'running') return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const currentDate = now.getDate();

      const todayEvents = calendarEvents.filter(e => 
        e.date === currentDate && e.month === currentMonth && e.year === currentYear
      );

      todayEvents.forEach(ev => {
        // Parse "10:00 AM" into hours and minutes
        const match = ev.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          let [_, hours, minutes, ampm] = match;
          hours = parseInt(hours, 10);
          minutes = parseInt(minutes, 10);
          if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;

          const eventTime = new Date(now);
          eventTime.setHours(hours, minutes, 0, 0);

          const diffMinutes = (eventTime - now) / 1000 / 60;

          // If event is exactly 15 minutes away (give or take the polling interval of 1 min)
          if (diffMinutes > 14 && diffMinutes <= 15) {
            addNotification(
              'Calendar Reminder',
              `${ev.title} starts in 15 minutes`,
              'calendar',
              10000
            );
          }
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [services, calendarEvents, addNotification]);

  // Weather Sync (Mock)
  useEffect(() => {
    const weatherService = services.find(s => s.id === 'weather');
    if (!weatherService || weatherService.status !== 'running') return;

    const interval = setInterval(() => {
      console.log('Background Service: Weather synced.');
    }, 300000); // 5 mins

    return () => clearInterval(interval);
  }, [services]);

  // GitHub Sync (Mock)
  useEffect(() => {
    const githubService = services.find(s => s.id === 'github');
    if (!githubService || githubService.status !== 'running') return;

    const interval = setInterval(() => {
      console.log('Background Service: GitHub synced.');
    }, 600000); // 10 mins

    return () => clearInterval(interval);
  }, [services]);

  return null; // Headless component
}

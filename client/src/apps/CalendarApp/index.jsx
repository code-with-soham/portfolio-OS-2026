// ============================================
// Portfolio OS 2026 — Calendar App
// ============================================
// Full-featured calendar with Month/Week/Day/List views,
// search, filters, drag-and-drop, and CRUD dialogs.
// Supports dark/light themes via data-theme attribute.

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';
import './CalendarApp.css';

// ========================
// Constants
// ========================
const EVENT_COLORS = [
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Purple', value: 'purple' },
  { name: 'Orange', value: 'orange' },
  { name: 'Pink', value: 'pink' },
  { name: 'Red', value: 'red' },
  { name: 'Teal', value: 'teal' },
  { name: 'Yellow', value: 'yellow' },
];

const CATEGORIES = ['Meeting', 'Task', 'Reminder', 'Personal', 'Interview', 'Exam', 'Event'];
const AVAILABLE_TAGS = ['Important', 'Urgent', 'Work', 'Personal', 'Team', 'Client'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

// ========================
// Utility Helpers
// ========================
function formatTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toLocalISOString(date) {
  if (!date) return '';
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function isSameDay(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getDate() === db.getDate() &&
    da.getMonth() === db.getMonth() &&
    da.getFullYear() === db.getFullYear();
}

// ========================
// Dropdown Component
// ========================
function FilterDropdown({ label, items, selected, onToggle, renderItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="cal-dropdown" ref={ref}>
      <button
        className={`cal-filter-btn ${selected.length > 0 ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        ⏷ {label}
        {selected.length > 0 && <span className="cal-filter-count">{selected.length}</span>}
      </button>
      {open && (
        <div className="cal-dropdown-menu">
          <div className="cal-dropdown-label">Filter by {label}</div>
          <div className="cal-dropdown-sep" />
          {items.map((item) => {
            const key = typeof item === 'string' ? item : item.value;
            const checked = selected.includes(key);
            return (
              <div
                key={key}
                className="cal-dropdown-item"
                onClick={() => onToggle(key)}
              >
                <span className={`cal-dropdown-check ${checked ? 'checked' : ''}`}>
                  {checked ? '✓' : ''}
                </span>
                {renderItem ? renderItem(item) : key}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ========================
// Event Dialog
// ========================
function EventDialog({
  isOpen,
  onClose,
  isCreating,
  eventData,
  onFieldChange,
  onSave,
  onDelete,
}) {
  if (!isOpen) return null;

  const toggleTag = (tag) => {
    const tags = eventData.tags || [];
    const newTags = tags.includes(tag)
      ? tags.filter(t => t !== tag)
      : [...tags, tag];
    onFieldChange('tags', newTags);
  };

  return (
    <div className="cal-dialog-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cal-dialog">
        <div className="cal-dialog-header">
          <h3 className="cal-dialog-title">{isCreating ? 'Create Event' : 'Event Details'}</h3>
          <p className="cal-dialog-desc">
            {isCreating ? 'Add a new event to your calendar' : 'View and edit event details'}
          </p>
        </div>

        <div className="cal-dialog-body">
          {/* Title */}
          <div className="cal-form-group">
            <label className="cal-label">Title</label>
            <input
              className="cal-input"
              value={eventData.title || ''}
              onChange={(e) => onFieldChange('title', e.target.value)}
              placeholder="Event title"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="cal-form-group">
            <label className="cal-label">Description</label>
            <textarea
              className="cal-textarea"
              value={eventData.description || ''}
              onChange={(e) => onFieldChange('description', e.target.value)}
              placeholder="Event description (optional)"
              rows={3}
            />
          </div>

          {/* Start / End Time */}
          <div className="cal-form-row">
            <div className="cal-form-group">
              <label className="cal-label">Start Time</label>
              <input
                className="cal-input"
                type="datetime-local"
                value={toLocalISOString(eventData.startTime)}
                onChange={(e) => onFieldChange('startTime', new Date(e.target.value))}
              />
            </div>
            <div className="cal-form-group">
              <label className="cal-label">End Time</label>
              <input
                className="cal-input"
                type="datetime-local"
                value={toLocalISOString(eventData.endTime)}
                onChange={(e) => onFieldChange('endTime', new Date(e.target.value))}
              />
            </div>
          </div>

          {/* Category */}
          <div className="cal-form-group">
            <label className="cal-label">Category</label>
            <select
              className="cal-select"
              value={eventData.category || CATEGORIES[0]}
              onChange={(e) => onFieldChange('category', e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div className="cal-form-group">
            <label className="cal-label">Color</label>
            <div className="cal-color-options">
              {EVENT_COLORS.map(c => (
                <div
                  key={c.value}
                  className={`cal-color-option cal-event-${c.value} ${eventData.color === c.value ? 'selected' : ''}`}
                  title={c.name}
                  onClick={() => onFieldChange('color', c.value)}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="cal-form-group">
            <label className="cal-label">Tags</label>
            <div className="cal-tags-group">
              {AVAILABLE_TAGS.map(tag => (
                <button
                  key={tag}
                  className={`cal-tag-toggle ${eventData.tags?.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="cal-dialog-footer">
          {!isCreating && (
            <button className="cal-btn cal-btn-danger" onClick={onDelete} style={{ marginRight: 'auto' }}>
              Delete
            </button>
          )}
          <button className="cal-btn" onClick={onClose}>Cancel</button>
          <button className="cal-btn cal-btn-primary" onClick={onSave}>
            {isCreating ? 'Create' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ========================
// Mini Calendar (Sidebar)
// ========================
function MiniCalendar({ currentDate, onDateSelect, events }) {
  const [miniDate, setMiniDate] = useState(new Date(currentDate));

  useEffect(() => {
    setMiniDate(new Date(currentDate));
  }, [currentDate]);

  const firstDay = new Date(miniDate.getFullYear(), miniDate.getMonth(), 1);
  const lastDay = new Date(miniDate.getFullYear(), miniDate.getMonth() + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = [];
  const cursor = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const hasEvent = (date) => {
    return events.some(e => isSameDay(e.startTime, date));
  };

  const today = new Date();

  return (
    <div className="cal-mini-calendar">
      <div className="cal-mini-header">
        <span className="cal-mini-title">
          {miniDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <div className="cal-mini-nav">
          <button
            className="cal-mini-nav-btn"
            onClick={() => setMiniDate(new Date(miniDate.getFullYear(), miniDate.getMonth() - 1, 1))}
          >‹</button>
          <button
            className="cal-mini-nav-btn"
            onClick={() => setMiniDate(new Date(miniDate.getFullYear(), miniDate.getMonth() + 1, 1))}
          >›</button>
        </div>
      </div>
      <div className="cal-mini-grid">
        {DAYS.map(d => (
          <div key={d} className="cal-mini-day-name">{d.charAt(0)}</div>
        ))}
        {days.map((day, i) => {
          const isOther = day.getMonth() !== miniDate.getMonth();
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, currentDate);
          const hasEvt = hasEvent(day);
          return (
            <div
              key={i}
              className={[
                'cal-mini-day',
                isOther ? 'other-month' : '',
                isToday ? 'today' : '',
                isSelected && !isToday ? 'selected' : '',
                hasEvt ? 'has-event' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onDateSelect(day)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ========================
// List View
// ========================
function ListView({ events, onEventClick }) {
  // Group events by date
  const grouped = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    const groups = {};
    sorted.forEach(evt => {
      const dateKey = new Date(evt.startTime).toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(evt);
    });
    return groups;
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="cal-list-container">
        <div className="cal-list-empty">
          <div className="cal-list-empty-icon">📅</div>
          <div>No events found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cal-list-container">
      {Object.entries(grouped).map(([date, dateEvents]) => (
        <div key={date} className="cal-list-group">
          <div className="cal-list-group-title">{date}</div>
          {dateEvents.map(evt => (
            <div
              key={evt.id}
              className="cal-list-item"
              onClick={() => onEventClick(evt)}
            >
              <div className={`cal-list-item-color cal-event-${evt.color || 'blue'}`} />
              <div className="cal-list-item-info">
                <div className="cal-list-item-title">{evt.title}</div>
                {evt.description && (
                  <div className="cal-list-item-desc">{evt.description}</div>
                )}
              </div>
              <div className="cal-list-item-time">
                {formatTime(evt.startTime)} – {formatTime(evt.endTime)}
              </div>
              {evt.tags?.length > 0 && (
                <div className="cal-list-item-tags">
                  {evt.tags.map(tag => (
                    <span key={tag} className="cal-list-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ========================
// Main CalendarApp Component
// ========================
export default function CalendarApp() {
  const events = useCalendarStore(s => s.events);
  const addEvent = useCalendarStore(s => s.addEvent);
  const updateEvent = useCalendarStore(s => s.updateEvent);
  const deleteEvent = useCalendarStore(s => s.deleteEvent);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState({
    title: '',
    description: '',
    startTime: null,
    endTime: null,
    color: 'blue',
    category: 'Meeting',
    tags: [],
  });

  // Normalize legacy events to the new format
  const normalizedEvents = useMemo(() => {
    return events.map(evt => {
      // If event already has startTime as a Date-like, keep it
      if (evt.startTime) {
        return {
          ...evt,
          startTime: new Date(evt.startTime),
          endTime: evt.endTime ? new Date(evt.endTime) : new Date(new Date(evt.startTime).getTime() + 60 * 60000),
          color: evt.color || 'blue',
          category: evt.category || evt.type || 'Event',
          tags: evt.tags || [],
        };
      }
      // Legacy format: { date, month, year, time }
      const dateObj = new Date(evt.year, evt.month, evt.date);
      // Parse time like "10:00 AM"
      const timeParts = evt.time?.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeParts) {
        let hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const ampm = timeParts[3].toUpperCase();
        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        dateObj.setHours(hours, minutes, 0, 0);
      }
      const endTime = new Date(dateObj.getTime() + 60 * 60000); // 1 hour duration
      return {
        ...evt,
        startTime: dateObj,
        endTime,
        color: evt.color || 'blue',
        category: evt.category || evt.type || 'Event',
        tags: evt.tags || [],
      };
    });
  }, [events]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return normalizedEvents.filter(evt => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches = evt.title?.toLowerCase().includes(q) ||
          evt.description?.toLowerCase().includes(q) ||
          evt.category?.toLowerCase().includes(q) ||
          evt.tags?.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedColors.length > 0 && !selectedColors.includes(evt.color)) return false;
      if (selectedTags.length > 0 && !evt.tags?.some(t => selectedTags.includes(t))) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(evt.category)) return false;
      return true;
    });
  }, [normalizedEvents, searchQuery, selectedColors, selectedTags, selectedCategories]);

  const hasActiveFilters = selectedColors.length > 0 || selectedTags.length > 0 || selectedCategories.length > 0;

  // Navigation
  const navigate = useCallback((dir) => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      if (view === 'month') d.setMonth(d.getMonth() + (dir === 'next' ? 1 : -1));
      else if (view === 'week') d.setDate(d.getDate() + (dir === 'next' ? 7 : -7));
      else if (view === 'day') d.setDate(d.getDate() + (dir === 'next' ? 1 : -1));
      return d;
    });
  }, [view]);

  // Open create dialog
  const openCreateDialog = () => {
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60000);
    setIsCreating(true);
    setEditingEvent({
      title: '',
      description: '',
      startTime: now,
      endTime: later,
      color: 'blue',
      category: 'Meeting',
      tags: [],
    });
    setDialogOpen(true);
  };

  // Open event for editing
  const openEditDialog = (evt) => {
    setIsCreating(false);
    setEditingEvent({ ...evt });
    setDialogOpen(true);
  };

  // Save event
  const handleSave = () => {
    if (!editingEvent.title || !editingEvent.startTime || !editingEvent.endTime) return;

    if (isCreating) {
      addEvent({
        title: editingEvent.title,
        description: editingEvent.description,
        startTime: editingEvent.startTime.toISOString(),
        endTime: editingEvent.endTime.toISOString(),
        color: editingEvent.color,
        category: editingEvent.category,
        tags: editingEvent.tags,
      });
    } else {
      updateEvent(editingEvent.id, {
        title: editingEvent.title,
        description: editingEvent.description,
        startTime: editingEvent.startTime instanceof Date ? editingEvent.startTime.toISOString() : editingEvent.startTime,
        endTime: editingEvent.endTime instanceof Date ? editingEvent.endTime.toISOString() : editingEvent.endTime,
        color: editingEvent.color,
        category: editingEvent.category,
        tags: editingEvent.tags,
      });
    }
    setDialogOpen(false);
  };

  // Delete event
  const handleDelete = () => {
    if (editingEvent.id) {
      deleteEvent(editingEvent.id);
    }
    setDialogOpen(false);
  };

  // Drag & Drop is handled internally by each view's *WithDrop component

  // Title
  const getTitle = () => {
    if (view === 'month') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (view === 'week') return `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    if (view === 'day') return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return 'All Events';
  };

  // Upcoming events for sidebar
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return normalizedEvents
      .filter(e => new Date(e.startTime) >= new Date(now.getFullYear(), now.getMonth(), now.getDate()))
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 8);
  }, [normalizedEvents]);


  return (
    <div className="calendar-app">
      {/* ======================== Sidebar ======================== */}
      <div className="cal-sidebar">
        <div className="cal-sidebar-header">
          <button className="cal-new-event-btn" onClick={openCreateDialog}>
            + New Event
          </button>
        </div>

        <MiniCalendar
          currentDate={currentDate}
          onDateSelect={(date) => {
            setCurrentDate(date);
            setView('day');
          }}
          events={normalizedEvents}
        />

        <div className="cal-upcoming">
          <div className="cal-upcoming-title">Upcoming Events</div>
          {upcomingEvents.length === 0 ? (
            <div className="cal-upcoming-empty">No upcoming events</div>
          ) : (
            upcomingEvents.map(evt => (
              <div
                key={evt.id}
                className="cal-upcoming-item"
                data-color={evt.color}
                onClick={() => openEditDialog(evt)}
              >
                <div className="cal-upcoming-info">
                  <div className="cal-upcoming-info-title">{evt.title}</div>
                  <div className="cal-upcoming-info-time">
                    {formatDate(evt.startTime)} • {formatTime(evt.startTime)}
                  </div>
                </div>
                <button
                  className="cal-upcoming-delete"
                  onClick={(e) => { e.stopPropagation(); deleteEvent(evt.id); }}
                  title="Delete event"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================== Main Content ======================== */}
      <div className="cal-main">
        {/* Header */}
        <div className="cal-header">
          <div className="cal-header-left">
            <h2 className="cal-title">{getTitle()}</h2>
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={() => navigate('prev')}>‹</button>
              <button className="cal-nav-btn today" onClick={() => setCurrentDate(new Date())}>Today</button>
              <button className="cal-nav-btn" onClick={() => navigate('next')}>›</button>
            </div>
          </div>

          <div className="cal-header-right">
            <div className="cal-search-wrapper">
              <span className="cal-search-icon">🔍</span>
              <input
                className="cal-search-input"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="cal-view-group">
              {['month', 'week', 'day', 'list'].map(v => (
                <button
                  key={v}
                  className={`cal-view-btn ${view === v ? 'active' : ''}`}
                  onClick={() => setView(v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="cal-filter-bar">
          <FilterDropdown
            label="Colors"
            items={EVENT_COLORS}
            selected={selectedColors}
            onToggle={(val) => setSelectedColors(prev =>
              prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
            )}
            renderItem={(color) => (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`cal-color-dot cal-event-${color.value}`} />
                {color.name}
              </span>
            )}
          />
          <FilterDropdown
            label="Tags"
            items={AVAILABLE_TAGS}
            selected={selectedTags}
            onToggle={(val) => setSelectedTags(prev =>
              prev.includes(val) ? prev.filter(t => t !== val) : [...prev, val]
            )}
          />
          <FilterDropdown
            label="Categories"
            items={CATEGORIES}
            selected={selectedCategories}
            onToggle={(val) => setSelectedCategories(prev =>
              prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]
            )}
          />
          {hasActiveFilters && (
            <button
              className="cal-filter-clear"
              onClick={() => { setSelectedColors([]); setSelectedTags([]); setSelectedCategories([]); setSearchQuery(''); }}
            >
              ✕ Clear all
            </button>
          )}
        </div>

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="cal-active-filters">
            <span className="cal-active-filters-label">Active:</span>
            {selectedColors.map(c => {
              const color = EVENT_COLORS.find(ec => ec.value === c);
              return (
                <span key={c} className="cal-active-filter-tag">
                  <span className={`cal-color-dot cal-event-${c}`} />
                  {color?.name || c}
                  <button onClick={() => setSelectedColors(prev => prev.filter(x => x !== c))}>✕</button>
                </span>
              );
            })}
            {selectedTags.map(t => (
              <span key={t} className="cal-active-filter-tag">
                {t}
                <button onClick={() => setSelectedTags(prev => prev.filter(x => x !== t))}>✕</button>
              </span>
            ))}
            {selectedCategories.map(c => (
              <span key={c} className="cal-active-filter-tag">
                {c}
                <button onClick={() => setSelectedCategories(prev => prev.filter(x => x !== c))}>✕</button>
              </span>
            ))}
          </div>
        )}

        {/* Calendar Views */}
        {view === 'month' && (
          <MonthViewWithDrop
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={openEditDialog}
            normalizedEvents={normalizedEvents}
            updateEvent={updateEvent}
          />
        )}
        {view === 'week' && (
          <WeekViewWithDrop
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={openEditDialog}
            normalizedEvents={normalizedEvents}
            updateEvent={updateEvent}
          />
        )}
        {view === 'day' && (
          <DayViewWithDrop
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={openEditDialog}
            normalizedEvents={normalizedEvents}
            updateEvent={updateEvent}
          />
        )}
        {view === 'list' && (
          <ListView events={filteredEvents} onEventClick={openEditDialog} />
        )}
      </div>

      {/* Event Dialog */}
      <EventDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        isCreating={isCreating}
        eventData={editingEvent}
        onFieldChange={(field, value) => setEditingEvent(prev => ({ ...prev, [field]: value }))}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

// ========================
// Drop-enabled wrappers
// ========================
// These wrappers use data attributes for clean drag-and-drop

function MonthViewWithDrop({ currentDate, events, onEventClick, normalizedEvents, updateEvent }) {
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const days = [];
  const cursor = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const today = new Date();

  const getEventsForDay = (date) => {
    return events.filter(e => isSameDay(e.startTime, date));
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const eventId = e.dataTransfer.getData('eventId');
    if (!eventId) return;

    const evt = normalizedEvents.find(ev => ev.id === eventId);
    if (!evt) return;

    const duration = new Date(evt.endTime).getTime() - new Date(evt.startTime).getTime();
    const newStart = new Date(day);
    newStart.setHours(new Date(evt.startTime).getHours(), new Date(evt.startTime).getMinutes(), 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    updateEvent(eventId, {
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
      date: newStart.getDate(),
      month: newStart.getMonth(),
      year: newStart.getFullYear(),
      time: newStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    });
  };

  return (
    <div className="cal-month-grid">
      {DAYS.map(d => (
        <div key={d} className="cal-month-day-name">{d}</div>
      ))}
      {days.map((day, i) => {
        const dayEvents = getEventsForDay(day);
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const isToday = isSameDay(day, today);

        return (
          <div
            key={i}
            className={[
              'cal-month-cell',
              !isCurrentMonth ? 'other-month' : '',
              isToday ? 'today' : '',
            ].filter(Boolean).join(' ')}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove('drag-over'); }}
            onDrop={(e) => handleDrop(e, day)}
          >
            <span className="cal-month-date">{day.getDate()}</span>
            <div className="cal-month-events">
              {dayEvents.slice(0, 3).map(evt => (
                <div
                  key={evt.id}
                  className={`cal-event-pill cal-event-${evt.color || 'blue'}`}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('eventId', evt.id)}
                  onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                  title={`${formatTime(evt.startTime)} ${evt.title}`}
                >
                  {evt.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="cal-month-more">+{dayEvents.length - 3} more</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeekViewWithDrop({ currentDate, events, onEventClick, normalizedEvents, updateEvent }) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const today = new Date();

  const getEventsForDayHour = (date, hour) => {
    return events.filter(e => {
      const s = new Date(e.startTime);
      return isSameDay(s, date) && s.getHours() === hour;
    });
  };

  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const eventId = e.dataTransfer.getData('eventId');
    if (!eventId) return;

    const evt = normalizedEvents.find(ev => ev.id === eventId);
    if (!evt) return;

    const duration = new Date(evt.endTime).getTime() - new Date(evt.startTime).getTime();
    const newStart = new Date(day);
    newStart.setHours(hour, 0, 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    updateEvent(eventId, {
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
      date: newStart.getDate(),
      month: newStart.getMonth(),
      year: newStart.getFullYear(),
      time: newStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    });
  };

  return (
    <div className="cal-week-container">
      <div className="cal-week-header">
        <div className="cal-week-header-time" />
        {weekDays.map(day => (
          <div
            key={day.toISOString()}
            className={`cal-week-header-day ${isSameDay(day, today) ? 'today' : ''}`}
          >
            <div className="cal-week-day-name">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className="cal-week-day-num">{day.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="cal-week-grid">
        {HOURS.map(hour => (
          <div key={`row-${hour}`} style={{ display: 'contents' }}>
            <div className="cal-week-time-label">
              {hour.toString().padStart(2, '0')}:00
            </div>
            {weekDays.map(day => {
              const hourEvents = getEventsForDayHour(day, hour);
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="cal-week-cell"
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove('drag-over'); }}
                  onDrop={(e) => handleDrop(e, day, hour)}
                >
                  {hourEvents.map(evt => (
                    <div
                      key={evt.id}
                      className={`cal-week-event cal-event-${evt.color || 'blue'}`}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('eventId', evt.id)}
                      onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function DayViewWithDrop({ currentDate, events, onEventClick, normalizedEvents, updateEvent }) {
  const getEventsForHour = (hour) => {
    return events.filter(e => {
      const s = new Date(e.startTime);
      return isSameDay(s, currentDate) && s.getHours() === hour;
    });
  };

  const handleDrop = (e, hour) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const eventId = e.dataTransfer.getData('eventId');
    if (!eventId) return;

    const evt = normalizedEvents.find(ev => ev.id === eventId);
    if (!evt) return;

    const duration = new Date(evt.endTime).getTime() - new Date(evt.startTime).getTime();
    const newStart = new Date(currentDate);
    newStart.setHours(hour, 0, 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    updateEvent(eventId, {
      startTime: newStart.toISOString(),
      endTime: newEnd.toISOString(),
      date: newStart.getDate(),
      month: newStart.getMonth(),
      year: newStart.getFullYear(),
      time: newStart.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    });
  };

  return (
    <div className="cal-day-container">
      {HOURS.map(hour => {
        const hourEvents = getEventsForHour(hour);
        return (
          <div
            key={hour}
            className="cal-day-row"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
            onDragLeave={(e) => { e.currentTarget.classList.remove('drag-over'); }}
            onDrop={(e) => handleDrop(e, hour)}
          >
            <div className="cal-day-time">
              {hour.toString().padStart(2, '0')}:00
            </div>
            <div className="cal-day-content">
              {hourEvents.map(evt => (
                <div
                  key={evt.id}
                  className={`cal-day-event cal-event-${evt.color || 'blue'}`}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('eventId', evt.id)}
                  onClick={(e) => { e.stopPropagation(); onEventClick(evt); }}
                >
                  <span className="cal-day-event-title">{evt.title}</span>
                  <span className="cal-day-event-time">
                    {formatTime(evt.startTime)} – {formatTime(evt.endTime)}
                  </span>
                  {evt.category && (
                    <span className="cal-day-event-category">{evt.category}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

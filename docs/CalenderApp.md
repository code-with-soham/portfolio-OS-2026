# 📅 Calendar App — Implementation Walkthrough

## Summary

Rebuilt the Calendar app in `portfolio-OS-2026` with a fully-featured, premium UI supporting **dark** (default) and **light** themes. The implementation uses vanilla React + CSS + Zustand — matching the project's existing architecture without introducing any new dependencies like shadcn/ui.

---

# Files Changed

## CalendarApp.css — NEW

### Highlights
- ~900 lines of premium CSS with full dark/light theme support via `[data-theme='dark']` pattern
- 8 event color variants with distinct dark/light appearances
- Glassmorphism effects (`backdrop-filter`, semi-transparent surfaces)
- Micro-animations:
  - `cal-fadeIn`
  - `cal-slideUp`
  - `cal-slideDown`
- Hover effects on:
  - Events
  - Sidebar items
  - Calendar cells
  - Filter buttons
- Drag-and-drop visual feedback (dashed accent outline)
- Responsive layout with sidebar + main content area

---

## index.jsx — REWRITTEN

Complete rewrite from approximately **140 lines** (prompt-based CRUD implementation) to approximately **1038 lines** featuring:

| Feature | Details |
|----------|----------|
| **4 Views** | Month, Week, Day, List — switchable via tab buttons |
| **Month View** | 7×6 grid with date numbers, event pills, and "+N more" overflow handling |
| **Week View** | 8-column grid (time column + 7 day columns) with hourly slots |
| **Day View** | 24-hour vertical timeline with detailed event cards |
| **List View** | Events grouped by date and sorted chronologically |
| **Mini Calendar** | Sidebar widget with month navigation, today highlight, and event indicators |
| **Sidebar** | New Event button, mini calendar, and upcoming events list |
| **Search** | Real-time text search across title, description, category, and tags |
| **Filters** | Dropdown filters for Colors (8), Tags (6), and Categories (7) |
| **Active Filter Tags** | Visual chips displaying active filters with remove actions |
| **CRUD Dialog** | Modal for create/edit/delete with title, description, datetime pickers, category selector, color picker, and tag toggles |
| **Drag & Drop** | Native HTML5 drag-and-drop for moving events between dates and time slots |
| **Legacy Compatibility** | Automatically normalizes old `{ date, month, year, time }` event format into modern `{ startTime, endTime }` format |

---

## useCalendarStore.js — UPDATED

### Store Enhancements

Added richer event schema support:

- `startTime`
- `endTime`
- `color`
- `category`
- `tags`
- `description`

### Default Sample Events

1. Mock Interview
2. TCS Exam
3. Hackathon
4. Portfolio Review
5. Team Standup
6. Gym Session

### New Store Actions

```js
clearAllEvents()
resetToDefaults()
```

### Compatibility

- Fully backward compatible
- Legacy events using `{ date, month, year, time }`
  are automatically normalized by the Calendar component

---

# Theme Support

| Token | Dark Theme | Light Theme |
|---------|-----------|------------|
| Background | `#1a1a1a` | `#f7f8fa` |
| Surface | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.85)` |
| Accent | `#60cdff` | `#0078d4` |
| Text | `#e5e5e5` | `#1a1a1a` |
| Border | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |

### Theme Inheritance

The Calendar app automatically inherits its theme from the OS-level:

```html
<div id="os-root" data-theme="dark">
```

or

```html
<div id="os-root" data-theme="light">
```

No additional theme configuration is required.

---

# Architecture Decisions

## 1. No shadcn/ui

The original reference implementation used:

- TypeScript
- shadcn/ui components

These were carefully adapted to:

- Vanilla React (JSX)
- Custom CSS
- Existing Zustand state management

This keeps the implementation fully aligned with the Portfolio OS architecture and avoids introducing additional dependencies.

---

## 2. Self-Contained Drag & Drop Views

Each major calendar view manages its own drag-and-drop behavior:

- `MonthViewWithDrop`
- `WeekViewWithDrop`
- `DayViewWithDrop`

Benefits:

- Encapsulated logic
- Easier maintenance
- Reduced cross-component coupling
- Better scalability

Implementation uses the native HTML5 `dataTransfer` API.

---

## 3. Event Normalization Layer

A dedicated normalization layer powered by `useMemo` converts all event data into a unified structure.

### Legacy Format

```js
{
  date,
  month,
  year,
  time
}
```

### Modern Format

```js
{
  startTime,
  endTime,
  title,
  description,
  category,
  color,
  tags
}
```

### Advantages

- Backward compatibility
- Smooth migration path
- Existing localStorage data remains usable
- Consistent rendering logic throughout the application

---

> [!NOTE]
>
> If old calendar data stored under the localStorage key
> `portfolio-os-calendar`
> displays stale or outdated events, users can:
>
> 1. Clear browser localStorage manually
> 2. Execute:
>
> ```js
> useCalendarStore.getState().resetToDefaults();
> ```
>
> from the browser console to restore the default event dataset.

---

# Result

✅ Premium Windows 11-style Calendar Experience  
✅ Full Dark / Light Theme Support  
✅ Month, Week, Day, and List Views  
✅ Search & Advanced Filtering  
✅ Drag-and-Drop Scheduling  
✅ Rich Event Management Dialogs  
✅ Responsive Layout  
✅ Backward-Compatible Data Model  
✅ Zero Additional Dependencies
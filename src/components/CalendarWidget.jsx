import React, { useEffect, useState } from 'react';

const CalendarWidget = ({ isOpen, date: initialDate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewDate, setViewDate] = useState(initialDate || new Date());
  const [showMonth, setShowMonth] = useState(true); // Toggle between month/year view (future feature)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync viewDate with initialDate if provided (optional, but good for opening)
  useEffect(() => {
    if (isOpen) {
      setViewDate(new Date()); // Reset to today when opening? Or keep last view? Let's reset to today.
    }
  }, [isOpen]);

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const getDaysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDay = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getFirstDay(viewDate);
  const currentDay = currentTime.getDate();
  const isCurrentMonth = viewDate.getMonth() === currentTime.getMonth() && viewDate.getFullYear() === currentTime.getFullYear();

  const blanks = Array(firstDay).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Pad to 42 cells (6 rows x 7 cols) to keep height consistent
  const totalCells = blanks.length + monthDays.length;
  const emptyCells = Array(42 - totalCells).fill(null);

  const changeMonth = (offset) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  const goToToday = () => {
    const now = new Date();
    setViewDate(now);
    setCurrentTime(now);
  };

  if (!isOpen) return null;

  return (
    <div
      className="calendar-widget"
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        bottom: '70px',
        right: '10px',
        width: '320px',
        background: 'var(--os-theme-card-bg, rgba(30, 30, 35, 0.85))',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '20px',
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'all' : 'none',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s ease',
        zIndex: 5001,
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Digital Clock Header */}
      <div style={{ paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '42px', fontWeight: '200', color: '#fff', lineHeight: '1' }}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--os-theme-accent, #3daee9)', marginTop: '5px', fontWeight: '500', transition: 'color 0.5s ease' }}>
          {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--os-theme-text, #eee)', transition: 'color 0.5s ease' }}>
            {viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <div className="cal-nav-btn" onClick={goToToday} title="Today" style={{ fontSize: '12px', width: 'auto', padding: '0 8px', borderRadius: '12px' }}>
              Today
            </div>
            <div className="cal-nav-btn" onClick={() => changeMonth(-1)}>▲</div>
            <div className="cal-nav-btn" onClick={() => changeMonth(1)}>▼</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          {days.map(d => <div key={d}>{d}</div>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px', textAlign: 'center', fontSize: '13px' }}>
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {monthDays.map(d => (
            <div
              key={d}
              className={`cal-day ${isCurrentMonth && d === currentDay ? 'today' : ''}`}
            >
              {d}
            </div>
          ))}
          {emptyCells.map((_, i) => (
            <div
              key={`empty-${i}`}
              className="cal-day"
              style={{ opacity: 0, pointerEvents: 'none' }}
            >
              30
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .cal-day {
          padding: 8px 0;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          color: #ccc;
        }
        .cal-day:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
        }
        .cal-day.today {
          background: var(--os-theme-accent, var(--accent));
          color: #fff;
          box-shadow: 0 0 10px var(--os-theme-accent, var(--accent));
          font-weight: bold;
        }
        .cal-nav-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #888;
          font-size: 10px;
          background: rgba(255,255,255,0.05);
          transition: all 0.2s;
        }
        .cal-nav-btn:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default CalendarWidget;

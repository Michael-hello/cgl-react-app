import { useState } from 'react';
import { DaysConst, type Day } from '@lib_framework';
import './DaySelector.css';

interface DaySelectorProps {
  selectedDays?: Day[];
  onDaysChange?: (selectedDays: Day[]) => void;
}

export function DaySelector({ selectedDays = [], onDaysChange }: DaySelectorProps) {
  const [checkedDays, setCheckedDays] = useState<Day[]>(selectedDays);

  const dayNames = Object.keys(DaysConst).sort((a, b) => {
    const dayA = DaysConst[a as Day];
    const dayB = DaysConst[b as Day];
    // Sort by day value (0-6), with Sunday (0) at the end
    if (dayA === 0) return 1;
    if (dayB === 0) return -1;
    return dayA - dayB;
  }) as Day[];

  const handleChange = (day: Day) => {
    const newCheckedDays = checkedDays.includes(day)
      ? checkedDays.filter(d => d !== day)
      : [...checkedDays, day];
    
    setCheckedDays(newCheckedDays);
    onDaysChange?.(newCheckedDays);
  };

  return (
    <>
    <label>Days available:</label>
      <div className="day-checkboxes">
        {dayNames.map((day) => (
          <div key={day} className="checkbox-group">
            <input
              type="checkbox"
              id={`day-${day}`}
              checked={checkedDays.includes(day)}
              onChange={() => handleChange(day)}
            />
            <label htmlFor={`day-${day}`}>{day.substring(0, 3)}</label>
          </div>
        ))}
      </div>
    </>
  );
}

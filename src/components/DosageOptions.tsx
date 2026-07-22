import { useState } from 'react';
import './DosageOptions.css';

interface DosageOptionsProps {
  type: 'Reducing' | 'Increasing' | 'Stabilisation';
  initialDose: number;
  deltaDose: number;
  frequency: number;
  onDosageChange: (initialDose: number, deltaDose: number, frequency: number) => void;
}

export function DosageOptions({
  type,
  initialDose,
  deltaDose,
  frequency,
  onDosageChange,
}: DosageOptionsProps) {
  const [dose, setDose] = useState<number>(initialDose);
  const [delta, setDelta] = useState<number>(deltaDose);
  const [freq, setFreq] = useState<number>(frequency);

  const handleDoseChange = (value: number) => {
    if(isNaN(value) || value < 0) return;               
    setDose(value);
    onDosageChange(value, delta, freq);
  };

  const handleDeltaChange = (value: number) => {
    if(isNaN(value) || value < 0) return;
    setDelta(value);
    onDosageChange(dose, value, freq);
  };

  const handleFreqChange = (value: number) => {
    if(isNaN(value) || value < 0) return;
    setFreq(value);
    onDosageChange(dose, delta, value);
  };

  return (
    <>
     
      <div className="dosage-input-group">
        <label htmlFor="initial-dose">Initial dosage (ml):</label>
        <input
          id="initial-dose"
          type="number"
          value={dose}
          onChange={(e) => handleDoseChange(Number(e.target.value))}
          min="0"
          step="0.5"
        />
      </div>

      <div className="dosage-input-group">
        <label htmlFor="delta-dose">
            { `${type === 'Reducing' ? 'Reduce' : 'Increase'} by (ml):` }
        </label>
        <input
          id="delta-dose"
          type="number"
          value={delta}
          onChange={(e) => handleDeltaChange(Number(e.target.value))}
          min="0"
          step="0.5"
        />
      </div>

      <div className="dosage-input-group">
        <label htmlFor="frequency">Frequency (days):</label>
        <input
          id="frequency"
          type="number"
          value={freq}
          onChange={(e) => handleFreqChange(Number(e.target.value))}
          min="1"
          step="1"
        />
      </div>
    </>
  );
}

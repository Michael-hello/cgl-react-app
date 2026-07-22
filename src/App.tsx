import { useEffect, useState } from 'react'
import { getBankHolidays, initPrescriptionState, type Country, type PrescriptionUserOptions } from '@lib_framework';
import { DaySelector, DosageOptions } from './components';

import './App.css'

function App() {

  const countries: Country[] = ['England', 'Scotland', 'Wales', 'Northern Ireland'];  

  const [options, setOptions] = useState<PrescriptionUserOptions>(initPrescriptionState());
  const [country, setCountry] = useState<Country>('England');

  let bankHolidays: Date[] = [];

  useEffect(() => {
    (async () => {
      bankHolidays = await getBankHolidays(country) || [];
      console.log(bankHolidays);
    })();
  }, [ country ]);


  //sets prescription type
  const setType = (type: string) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      type: type as PrescriptionUserOptions['type'],
    }));
  };

  //sets stabilisation dosage
  const setStabilisationDosage = (value: string) => {
    const dosage = parseFloat(value);
    if (!isNaN(dosage) && dosage >= 0) {
      setOptions((prevOptions) => ({
        ...prevOptions,
        stabilisationDosage: dosage,
      }));
    }
  };

  return (
    <>
      <section id="center">

        <div className="form-group" style={{ gridTemplateColumns: '150px 500px' }}>
          <DaySelector
            selectedDays={options.daysAvailable}
            onDaysChange={(days) => setOptions({ ...options, daysAvailable: days })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="country-select">Country:</label>
          <select
            id="country-select"
            value={country}
            onChange={(e) => setCountry(e.target.value as Country)}
          >
          {countries.map((countryOption) => (
            <option key={countryOption} value={countryOption}>
              {countryOption}
            </option>
          ))}
        </select>
        </div>

        <div className="form-group">
          <label htmlFor="type-select">Prescription type:</label>
          <select
            id="type-select"
            value={options.type}
            onChange={(e) => setType(e.target.value )}
          >
            <option value="Stabilisation">Stabilisation</option>
            <option value="Increasing">Increasing</option>
            <option value="Reducing">Reducing</option>
          </select>
        </div>

        {options.type === 'Stabilisation' ? (
          <div className="form-group">
            <label htmlFor="dosage-input">Dosage (ml):</label>
            <input
              id="dosage-input"
              type="number"
              value={options.stabilisationDosage}
              onChange={(e) => setStabilisationDosage(e.target.value)} 
            />
          </div>
        ) : (
          <DosageOptions
            type={options.type}
            initialDose={options.TROptions.initialDose}
            deltaDose={options.TROptions.deltaDose}
            frequency={options.TROptions.frequency}
            onDosageChange={(dose, delta, freq) => {
              setOptions({
                ...options,
                TROptions: { ...options.TROptions, initialDose: dose, deltaDose: delta, frequency: freq }
              });
            }}
          />
        )}

      </section>
    </>
  )
}

export default App

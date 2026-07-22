import { validateOptions, generatePrescription, getStartDate, type Prescription, type PrescriptionUserOptions } from '@lib_framework';
import './PrescriptionButton.css';
import { useState } from 'react';

interface PrescriptionButtonProps {
  options: PrescriptionUserOptions;
  bankHolidays: Date[];
}

export function PrescriptionButton({ options, bankHolidays }: PrescriptionButtonProps) {

    const [ errors, setErrors ] = useState<string[]>([]);
    const [ prescription, setPrescription ] = useState<Prescription | null>(null);

    const openDialog = () => {
      const dialog = document.getElementById('my-dialog') as HTMLDialogElement;
      setErrors(validateOptions(options));
      if (errors.length === 0) {
        let startDate = getStartDate(options.daysAvailable);
        let presc = generatePrescription(options, startDate, bankHolidays);
        presc.dosages = presc.dosages.sort((a, b) => a.date.getTime() - b.date.getTime());
        setPrescription(presc);
      };
      dialog?.showModal();
    };
    
    const closeDialog = () => {
      const dialog = document.getElementById('my-dialog') as HTMLDialogElement;
      dialog?.close();
      setErrors([]);
      setPrescription(null);
    };

    const formatDate = (dosage: { day: string, dosage: number, date: Date }) => {
       return dosage.date.toLocaleDateString('en-GB', {timeZone: 'UTC'});
    };

  return (
    <>
        <button 
            className="prescription-button" 
            onClick={openDialog}>
                Generate Prescription
        </button>

        <dialog id="my-dialog">
            {errors.length > 0 ? (
                <div className="container">
                    <h3>Validation Errors:</h3>
                    <ul>
                        {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="container" style={{ width: '300px' }}>
                    <h3>{ prescription?.name || 'Prescription' }:</h3>
                    {prescription?.dosages.map((dosage, index) => (
                        <div className="prescription-row" key={index}>
                            <p>{dosage.day}</p>
                            <p>{formatDate(dosage)}</p>
                            <p>{`${dosage.dosage} ${options.dosageUnits}`}</p>
                        </div>
                    ))}
                </div>
            )}
            <button className="closeDialog" onClick={closeDialog}>Close</button>
        </dialog>
    </>

  );
}

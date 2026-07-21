
import type { Day, Prescription, PrescriptionUserOptions } from './_prescription';
import { v4 as uuidv4 } from 'uuid';


export function initPrescriptionState(): PrescriptionUserOptions {
  return {
    daysAvailable: [],
    type: 'Stabilisation',
    stabilisationDosage: 0,
    dosageUnits: 'ml',

    TROptions: {
        dosageUnits: 'ml',
        initialDose: 0,   
        deltaDose: 0,
        frequency: 0
    }
  };
};


export function generatePrescriptionId(options: PrescriptionUserOptions): Prescription {

    const startDate = new Date().toISOString();

    let dosages: { day: Day, dosage: number }[] = [];

    return {
        id: uuidv4(),
        name: `2 week ${options.type} prescription `,
        startDate,
        userOpts: { ...options },
        dosages
    }
};
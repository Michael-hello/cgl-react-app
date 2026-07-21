
export interface Prescription {
  id: string;
  name: string;
  startDate: string;
  userOpts: PrescriptionUserOptions;
  dosages: { day: Day, dosage: number }[];
};  


export interface PrescriptionUserOptions {
    daysAvailable: Day[];
    type: 'Reducing' | 'Increasing' | 'Stabilisation';
    
    stabilisationDosage: number;
    readonly dosageUnits: 'ml';

    //titration or reducing prescription options
    TROptions: TitrationReducingOptions;
};


export interface TitrationReducingOptions {
    readonly dosageUnits: 'ml';

    initialDose: number;    // Initial Daily Dose: This is the dose that they will be on at the start of the prescription.
    deltaDose: number;    // Increase/Decrease: How much the prescription changes by (e.g. 4 ml)
    frequency: number;    // Every: How often the increase or decrease occurs (e.g. 3 days)
};


export const DaysConst = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7
} as const;


export type Day = keyof typeof DaysConst;

export type Country = 'Scotland' | 'England' | 'Wales' | 'Northern Ireland';


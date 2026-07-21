
export interface Prescription {
  id: string;
  name: string;
  startDate: Date;
  userOpts: PrescriptionUserOptions;
  dosages: { day: Day, dosage: number, date: Date }[];
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


//values are inline with the JS Date getDay() method, where 0 is Sunday and 6 is Saturday
export const DaysConst = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0
} as const;

//mapper function to get object key from value
export function getDayName(dayNumber: number): Day | undefined {
  return Object.entries(DaysConst).find(([_, value]) => value === dayNumber)?.[0] as Day | undefined;
};

export type Day = keyof typeof DaysConst;

export type Country = 'Scotland' | 'England' | 'Wales' | 'Northern Ireland';


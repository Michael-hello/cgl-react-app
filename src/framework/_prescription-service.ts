
import { isBankHoliday } from './_bank-holidays';
import { DaysConst, getDayName, type Day, type Prescription, type PrescriptionUserOptions } from './_prescription';
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


export function generatePrescription(
  options: PrescriptionUserOptions,
  startDate: Date,
  bankHolidays: Date[]
): Prescription {

    let dosages = calculateDosages(startDate, options, bankHolidays);

    return {
        id: uuidv4(),
        name: `2 week ${options.type} prescription `,
        startDate,
        userOpts: { ...options },
        dosages
    }
};


export function calculateDosages(
  startDate: Date, 
  options: PrescriptionUserOptions, 
  bankHolidays: Date[]
): { day: Day, dosage: number, date: Date }[] {

    let dosages: { day: Day, dosage: number, date: Date }[] = []; 
    let chosenDays = options.daysAvailable;
    const prescriptionLength = 14; // 2 weeks

    let dosage = 0;

    for(let i = prescriptionLength - 1; i >= 0; i--) {

      dosage += options.stabilisationDosage;

      let days = startDate.getDate() + i;
      let currentDate = new Date(startDate);  
      currentDate.setDate(days);
      let thisDay = currentDate.getDay(); //returns day of the week as a number (0-6) where 0 is Sunday and 6 is Saturday
      let currentDay = getDayName(thisDay) as Day;
      let isBH = isBankHoliday(currentDate, bankHolidays);

      //not a BH and user available for pickup
      if(chosenDays.includes(currentDay) && !isBH) {
          dosages.push({ day: currentDay, dosage, date: currentDate });
          dosage = 0; //reset dosage for next pickup day
      } else {
         dosages.push({ day: currentDay, dosage: 0, date: currentDate }); //no pickup today
      };
    };    

    return dosages;
};
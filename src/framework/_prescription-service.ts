
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
        name: `2 week ${options.type.toLocaleLowerCase()} prescription `,
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

    let dailyDosages = calculateDailyDosage(options, prescriptionLength);
    let dosage = 0;

    for(let i = prescriptionLength - 1; i >= 0; i--) {

      dosage += dailyDosages[i];

      let days = startDate.getUTCDate() + i;
      let currentDate = new Date(startDate);  
      currentDate.setUTCDate(days);
      let thisDay = currentDate.getUTCDay(); //returns day of the week as a number (0-6) where 0 is Sunday and 6 is Saturday
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



//calculates what the dosage is for each day, irrespective of user availability
export function calculateDailyDosage(options: PrescriptionUserOptions, prescriptionLength: number): { [key: number]: number } {

  let dosages: { [key: number]: number } = {}; 

  if(options.type === 'Stabilisation') {
    for(let i = 0; i < prescriptionLength; i++) {
      dosages[i] = options.stabilisationDosage;
    }
  };

  if(options.type === 'Reducing' || options.type === 'Increasing') {
    let currentDose = options.TROptions.initialDose;
    let scalar = options.type === 'Reducing' ? -1 : 1;
    for(let i = 0; i < prescriptionLength; i++) {
      if(i % (options.TROptions.frequency) === 0 && i > 0) {
        currentDose += scalar * options.TROptions.deltaDose;
        if(currentDose < 0) currentDose = 0;
      };
      dosages[i] = currentDose;
    };
  };

  return dosages;
};


export function getStartDate(chosenDays: Day[]): Date {
  const today = new Date();
  const todayDayNumber = today.getUTCDay(); //returns day of the week as a number (0-6) where 0 is Sunday and 6 is Saturday
  const todayDay: Day = getDayName(todayDayNumber) as Day;

  if(todayDay && chosenDays.includes(todayDay)) {
    return today; //today is a valid pickup day
  };

  //find the next available pickup day
  for(let i = 1; i <= 7; i++) {
    const nextDate = new Date(today);
    nextDate.setUTCDate(today.getUTCDate() + i);
    const nextDayNumber = nextDate.getUTCDay();
    const nextDay: Day = getDayName(nextDayNumber) as Day;
    if(nextDay && chosenDays.includes(nextDay)) {
      return nextDate;
    }
  };

  return today; //return today as a fallbaac for now

};
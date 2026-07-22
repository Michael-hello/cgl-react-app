import { describe, expect, it } from "vitest";
import { calculateDosages, getDayName, getStartDate, type Day, type PrescriptionUserOptions } from "@lib_framework";



function mockOptions(type: 'Reducing' | 'Increasing' | 'Stabilisation'): PrescriptionUserOptions {
  return {
    daysAvailable: [ 'Monday', 'Friday'],
    type: type,
    stabilisationDosage: 60,
    dosageUnits: 'ml',    
    TROptions: {
        dosageUnits: 'ml',
        initialDose: 60,
        deltaDose: 5,
        frequency: 2
    }  
  }
};


describe('get correct start dates', () => { 
  
  
  it('check returns next friday', async () => {

    const startDate = new Date("2026-07-22"); //wednesday
    const expected = new Date("2026-07-24"); //friday
    const chosen: Day[] = [ 'Monday', 'Friday'];

    const result = getStartDate(chosen, startDate);
    const day = result.getUTCDay();
    const dayName = getDayName(day) as Day;

    expect(dayName).toBe('Friday');
    expect(result.getTime()).toBe(expected.getTime());
  });


  it('check it uses today', async () => {

    const startDate = new Date("2026-07-22"); //wednesday
    const expected = new Date("2026-07-22"); //wednesday
    const chosen: Day[] = [ 'Wednesday', 'Sunday'];

    const result = getStartDate(chosen, startDate);
    const day = result.getUTCDay();
    const dayName = getDayName(day) as Day;

    expect(dayName).toBe('Wednesday');
    expect(result.getTime()).toBe(expected.getTime());
  });

});
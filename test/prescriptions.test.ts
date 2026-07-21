import { describe, expect, it } from "vitest";
import { calculateDosages, type PrescriptionUserOptions } from "@lib_framework";



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
        frequency: 4
    }  
  }
};


describe('test prescription generator and helpers', () => { 


  it('check dosages are calculated correctly', async () => {

    const startDate = new Date("2026-05-26");
    const options: PrescriptionUserOptions = mockOptions('Stabilisation'); 
    const bankHolidays = [ new Date("2026-05-27") ]; 

    const dosages = calculateDosages(startDate, options, bankHolidays);
    console.log(dosages);

    expect(dosages).toHaveLength(14);
  });

});
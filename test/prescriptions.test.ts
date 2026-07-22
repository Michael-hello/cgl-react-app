import { describe, expect, it } from "vitest";
import { calculateDailyDosage, calculateDosages, type PrescriptionUserOptions } from "@lib_framework";



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


describe('test daily prescriptions are correct', () => { 


  it('check daily dosages are correct for reducing every 5 days', () => {

    const options: PrescriptionUserOptions = mockOptions('Reducing'); 
    options.TROptions.frequency = 5;
    const prescriptionLength = 14;
    const dailyDosages = calculateDailyDosage(options, prescriptionLength);
    const dosages = Object.values(dailyDosages);

    expect(dosages).toHaveLength(14);
    expect(dosages[0]).toBe(60);
    expect(dosages[13]).toBe(50);
  });

  
  it('check daily dosages are correct for increasing every 2 days', () => {

    const options: PrescriptionUserOptions = mockOptions('Increasing'); 
    options.TROptions.frequency = 2;
    const prescriptionLength = 14;
    const dailyDosages = calculateDailyDosage(options, prescriptionLength);
    const dosages = Object.values(dailyDosages);

    expect(dosages[0]).toBe(60);
    expect(dosages[13]).toBe(90);
  });


  it('check daily dosages are correct for stabilisation', () => {

    const options: PrescriptionUserOptions = mockOptions('Stabilisation'); 
    options.stabilisationDosage = 22;
    const prescriptionLength = 14;
    const dailyDosages = calculateDailyDosage(options, prescriptionLength);
    const dosages = Object.values(dailyDosages);

    expect(dosages[0]).toBe(22);
    expect(dosages[13]).toBe(22);
  });

  it('check daily dosages are correct for reducing every day', () => {

    const options: PrescriptionUserOptions = mockOptions('Reducing'); 
    options.TROptions.frequency = 1;
    const prescriptionLength = 5;
    const dailyDosages = calculateDailyDosage(options, prescriptionLength);
    const dosages = Object.values(dailyDosages);

    expect(dosages).toHaveLength(5);
    expect(dosages[0]).toBe(60);
    expect(dosages[4]).toBe(40);
  });

  it('check daily dosages dont drop below 0', () => {

    const options: PrescriptionUserOptions = mockOptions('Reducing'); 
    options.TROptions.frequency = 1;
    options.TROptions.deltaDose = 20;
    const prescriptionLength = 14;
    const dailyDosages = calculateDailyDosage(options, prescriptionLength);
    const dosages = Object.values(dailyDosages);

    expect(dosages[1]).toBe(40);
    expect(dosages[13]).toBe(0);
  });
});



describe('test final user prescriptions are correct', () => { 


  it('check user dosages are correct - stabilisation', async () => {

    const startDate = new Date("2026-05-26");
    const options: PrescriptionUserOptions = mockOptions('Stabilisation'); 
    const bankHolidays = [ new Date("2026-05-27") ]; 

    const dosages = calculateDosages(startDate, options, bankHolidays);

    let totalDosage = dosages.reduce((acc, curr) => acc + curr.dosage, 0);
    let sorted = dosages.sort((a, b) => a.date.getTime() - b.date.getTime());

    expect(dosages).toHaveLength(14);
    expect(totalDosage).toBe(840);
    expect(sorted[0].day).toBe('Monday');
    expect(sorted[0].dosage).toBe(240);
  });

  
  
  it('check user dosages are correct - reducing', async () => {

    const startDate = new Date("2026-05-26");
    const options: PrescriptionUserOptions = mockOptions('Reducing'); 
    options.daysAvailable = ['Monday',  'Thursday', 'Sunday'];
    const bankHolidays: Date[] = []//[ new Date("2026-05-27") ]; 

    const dosages = calculateDosages(startDate, options, bankHolidays);

    let totalDosage = dosages.reduce((acc, curr) => acc + curr.dosage, 0);
    let sorted = dosages.sort((a, b) => a.date.getTime() - b.date.getTime());
    console.log(sorted)

    expect(dosages).toHaveLength(14);
    expect(totalDosage).toBe(630);
    expect(dosages[0].day).toBe('Monday');
    expect(dosages[0].dosage).toBe(175);
  });

});
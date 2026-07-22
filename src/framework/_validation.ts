import type { PrescriptionUserOptions } from './_prescription';

export function validateOptions(options: PrescriptionUserOptions): string[] {
    let errors: string[] = [];

    if (options.daysAvailable.length === 0) {
        errors.push('Please select at least one day of the week for the prescription.');
    };

    if (options.type === 'Stabilisation') {
        if (options.stabilisationDosage === undefined || options.stabilisationDosage <= 0)
            errors.push('Please enter a valid stabilisation dosage greater than 0.');
        if ( options.stabilisationDosage > 60 )
            errors.push('Please enter a valid stabilisation dosage less than or equal to 60.');
    };

    if (options.type === 'Reducing' || options.type === 'Increasing') {
        let frequency = options.TROptions.frequency;
        let initialDose = options.TROptions.initialDose;

        if ( initialDose > 60 )
            errors.push('Please enter a valid initial dose less than or equal to 60.');
        if ( options.TROptions.initialDose <= 0 ) 
            errors.push('Please enter a valid initial dose greater than 0.');
        if ( options.TROptions.deltaDose <= 0 )
            errors.push('Please enter a valid change in dose greater than 0.');
        if ( frequency <= 0 )
            errors.push('Please enter a valid frequency greater than 0.');
        if ( frequency - Math.floor(frequency) !== 0 )
            errors.push('Frequency must be a whole number.');
    };

    return errors;
};
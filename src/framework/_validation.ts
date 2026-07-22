import type { PrescriptionUserOptions } from './_prescription';

export function validateOptions(options: PrescriptionUserOptions): string[] {
    let errors: string[] = [];

    if (options.daysAvailable.length === 0) {
        errors.push('Please select at least one day of the week for the prescription.');
    };

    if (options.type === 'Stabilisation' && (options.stabilisationDosage === undefined || options.stabilisationDosage <= 0)) {
        errors.push('Please enter a valid stabilisation dosage greater than 0.');
    };

    if (options.type === 'Reducing' || options.type === 'Increasing') {
        if ( options.TROptions.initialDose <= 0 ) 
            errors.push('Please enter a valid initial dose greater than 0.');
        if ( options.TROptions.deltaDose <= 0 )
            errors.push('Please enter a valid change in dose greater than 0.');
        if ( options.TROptions.frequency <= 0 )
            errors.push('Please enter a valid frequency greater than 0.');
    };

    return errors;
};
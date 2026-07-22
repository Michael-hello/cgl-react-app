import type { Country } from "./_prescription";

    
//fetch bank holidays from gov.uk api for given country
export async function getBankHolidays(country: Country): Promise<Date[] | null> {

    const URL = 'https://www.gov.uk/bank-holidays.json';

    try {
        let response = await fetch(URL);

        if(response && response.ok) {
            let data = await response.json();
            return processBankHolidays(data, country);
        };
        return null;
    } catch (error) {
        console.error('Error fetching bank holidays:', error);
        return null;
    };
};


//process fetch response and extract bank holiday dates for given country
function processBankHolidays(data: any, country: Country): Date[] | null {

    let countryKey = 'scotland';
    if(country === 'England' || country === 'Wales') countryKey = 'england-and-wales'; 
    if(country === 'Northern Ireland') countryKey = 'northern-ireland';
    
    if(data && data[countryKey] && data[countryKey].events) {
        let events = data[countryKey].events;
        let filteredEvents = events.filter((event: any) => {
            return event.date;
        });
        return filteredEvents.map((x: any) => new Date(x.date));
    } else {
        console.error(`No bank holiday data found for ${country}`);
        return null;
    }
};


//return dates that sit within range from and to, inclusive, from the given bank holidays array
export function filterBankHolidays(from: Date, to: Date, bankHolidays: Date[]): Date[] {
    return bankHolidays.filter(bh => bh.getTime() >= from.getTime() && bh.getTime() <= to.getTime());
};

export function isBankHoliday(x: Date, bankHolidays: Date[]): boolean {
    return bankHolidays.some(bh => bh.getTime() === x.getTime());
};
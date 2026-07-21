import type { Country } from "./_prescription";

    

export async function getBankHolidays(country: Country, years: number[]): Promise<Date[] | null> {

    const URL = 'https://www.gov.uk/bank-holidays.json';

    try {
        let response = await fetch(URL);

        if(response && response.ok) {
            let data = await response.json();
            return processBankHolidays(data, country, years);
        };
        return null;
    } catch (error) {
        console.error('Error fetching bank holidays:', error);
        return null;
    };
};



function processBankHolidays(data: any, country: Country, years: number[]): Date[] | null {

    let countryKey = 'scotland';
    if(country === 'England' || country === 'Wales') countryKey = 'england-and-wales'; 
    if(country === 'Northern Ireland') countryKey = 'northern-ireland';
    
    if(data && data[countryKey] && data[countryKey].events) {
        let events = data[countryKey].events;
        let filteredEvents = events.filter((event: any) => {
            if(!event.date) return false;
            let eventYear = new Date(event.date).getFullYear();
            return years.includes(eventYear);
        });
        console.log(`Bank holidays in ${country} for ${years.join(', ')}:`, filteredEvents);
        return filteredEvents.map((x: any) => new Date(x.date));
    } else {
        console.error(`No bank holiday data found for ${country}`);
        return null;
    }
};
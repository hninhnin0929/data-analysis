// filter.ts
export function filterByDateRange(data: any[], startDate: Date, endDate: Date) {
    return data.filter((row) => {
        const dateString = row['발주시기']; 

        if (typeof dateString !== 'string') {
            console.warn('Date is not a string in row:', row);
            return false;
        }

        // Parse the Korean date string into a JavaScript Date object
        const rowDate = parseKoreanDate(dateString);
        // console.log("role date-----", rowDate);
        if (!rowDate) {
            console.warn('Invalid date format in row:', row);
            return false;
        }

        // Compare dates
        return rowDate >= startDate && rowDate <= endDate;
    });
}

// Function to parse Korean date strings into JavaScript Date objects
function parseKoreanDate(koreanDate: string): Date | null {
    try {
        // Split the Korean date string into year and month parts
        const parts = koreanDate.split(' ');
        const year = parseInt(parts[0].replace('년', ''));
        const month = parseInt(parts[1].replace('월', '')) - 1; // Month is zero-based in JavaScript Date objects

        // Return a new Date object with the parsed year and month
        return new Date(year, month);
    } catch (error) {
        console.error('Error parsing date:', koreanDate, error);
        return null;
    }
}

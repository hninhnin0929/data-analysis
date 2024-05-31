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
//-------------------------------------------------


export function filterByCategory(data: any[], columnName: string, category: string) {
    return data.filter((row) => row[columnName] === category); 
}

//--------------------------------------------------------------------------------

export function filterByThreshold(data: any[], columnName: string, threshold: number) {

    return data.filter((row) => {
        const amountString = row[columnName];
        if (typeof amountString !== 'string') {
            console.warn('amount is not a number string in row:', row);
            return false;
        }

        const amount = parseInt(row[columnName].replace(/,/g, ''));
        if (isNaN(amount)) {
            console.warn('Invalid format in row:', row);
            return false;
        }

        return amount > threshold;
    });
}

//--------------------------------------------------------------------------------------

export function filterByFrequency(data: any[], columnName: string, frequency: number) {
    const counts: Record<string, number> = {};
    data.forEach((row) => {
        const key = row[columnName] as unknown as string; 
        counts[key] = (counts[key] || 0) + 1;
    });
    return data.filter((row) => counts[row[columnName]] >= frequency);
}
// only those rows where the value '신규'  appears more than 50(frequency) times in column '유형'
//---------------------------------------------------------------------------------------

export function filterByPattern(data: any[], columnName: string, pattern: string) {
    const regex = new RegExp(pattern, 'i'); // Case-insensitive matching
    return data.filter((row) => regex.test(row[columnName])); 
}
// filters an array of objects based on whether a specified pattern matches the text in a specific column of each object.
//------------------------------------------------------------------------------------------------------------------

export function getTopN(data: any[], columnName: string, n: number) {
    // Preprocess data: convert 'columnName' values to numbers
    const processedData = data.map(row => {
        const amountString = row[columnName];
        if (typeof amountString !== 'string') {
            console.warn(`Column "${columnName}" is not a string in row:`, row);
            return null;
        }

        const amount = parseInt(amountString.replace(/,/g, ''), 10);
        if (isNaN(amount)) {
            console.warn(`Invalid format in column "${columnName}" in row:`, row);
            return null;
        }

        return { ...row, [columnName]: amount };
    }).filter(Boolean); // Remove rows with null values after preprocessing

    // Sort the processed data based on the 'columnName' values in descending order
    processedData.sort((a, b) => b[columnName] - a[columnName]);

    // Return the top N rows
    return processedData.slice(0, n);
}


//--------------------------------------------------------------------------------------------------------------------
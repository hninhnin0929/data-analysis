// filter.ts

// Function to clean data
export function cleanData(data: any[]) {
    // Create a map to track unique rows
    const uniqueRows = new Map<string, boolean>();

    return data
        .map(row => {
            const cleanedRow = { ...row };

            // Convert '예산액(원)' values from string to number and remove commas
            if (typeof cleanedRow['예산액(원)'] === 'string') {
                cleanedRow['예산액(원)'] = parseInt(cleanedRow['예산액(원)'].replace(/,/g, ''), 10);
            }

            // Standardize formatting and remove additional spaces
            Object.keys(cleanedRow).forEach(key => {
                if (typeof cleanedRow[key] === 'string') {
                    cleanedRow[key] = cleanedRow[key].trim().replace(/\s+/g, ' ');
                }
            });

            return cleanedRow;
        })
        .filter(row => {
            // Create a string representation of the row to check for duplicates
            const rowString = JSON.stringify(row);
            if (uniqueRows.has(rowString)) {
                return false;
            }
            uniqueRows.set(rowString, true);
            return true;
        });
}

// --------------------------------------------------

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
        // const amountString = row[columnName];
        // if (typeof amountString !== 'string') {
        //     console.warn('amount is not a number string in row:', row);
        //     return false;
        // }

        // const amount = parseInt(row[columnName].replace(/,/g, ''));
        // if (isNaN(amount)) {
        //     console.warn('Invalid format in row:', row);
        //     return false;
        // }
        const amount = parseInt(row[columnName]);
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

// export function filterByPattern(data: any[], columnName: string, pattern: string) {
//     const regex = new RegExp(pattern, 'i'); // Case-insensitive matching
//     return data.filter((row) => regex.test(row[columnName])); 
// }
export function filterByPattern(data: any[], columnName: string, patterns: string[]) {
    return data.filter(row => {
        const cellValue = row[columnName];
        if (typeof cellValue !== 'string') {
            console.warn(`Value in column ${columnName} is not a string in row:`, row);
            return false;
        }

        const lowerCaseCellValue = cellValue.toLowerCase();
        return patterns.some(pattern => lowerCaseCellValue.includes(pattern.toLowerCase()));
    });
}

interface Keyword {
    keyword: string;
    score: number;
}
export function filterByKeywordScore(data: any[], columnName: string, keywords: Keyword[], minScore: number) {
    return data.filter(row => {
        const cellValue = row[columnName];
        if (typeof cellValue !== 'string') {
            console.warn(`Value in column ${columnName} is not a string in row:`, row);
            return false;
        }

        const lowerCaseCellValue = cellValue.toLowerCase();
        let totalScore = 0;

        keywords.forEach(({ keyword, score }) => {
            if (lowerCaseCellValue.includes(keyword.toLowerCase())) {
                totalScore += score;
            }
        });

        return totalScore >= minScore;
    });
}


// filters an array of objects based on whether a specified pattern matches the text in a specific column of each object.
//------------------------------------------------------------------------------------------------------------------

export function getTopN(data: any[], columnName: string, n: number) {
    // Preprocess data: convert 'columnName' values to numbers
    const processedData = data.map(row => {
        const amountString = row[columnName];
        // if (typeof amountString !== 'string') {
        //     console.warn(`Column "${columnName}" is not a string in row:`, row);
        //     return null;
        // }

        // const amount = parseInt(amountString.replace(/,/g, ''), 10);
        const amount = parseInt(amountString);
        if (isNaN(amount)) {
            console.warn(`Invalid format in column "${columnName}" in row:`, row);
            return null;
        }

        return { ...row, [columnName]: row[columnName] };
    }).filter(Boolean); // Remove rows with null values after preprocessing

    // Sort the processed data based on the 'columnName' values in descending order
    processedData.sort((a, b) => b[columnName] - a[columnName]);

    // Return the top N rows
    return processedData.slice(0, n);
}

//--------------------------------------------------------------------------------------------------------------------

export function multiCriteriaFilter(data: any[], criteria: { column: string, value: any }[]) {
    return data.filter((row) => criteria.every((c) => row[c.column] === c.value));
}
//----------------------------------------------------------------------------------------------------

export function filterOutliers(data: any[], columnName: string, threshold: number) {
        // Preprocess data: convert 'columnName' values to numbers
        const processedData = data.map(row => {
            const amountString = row[columnName];

            const amount = parseInt(amountString, 10);
            if (isNaN(amount)) {
                console.warn(`Invalid format in column "${columnName}" in row:`, row);
                return null;
            }
    
            return { ...row, [columnName]: amount };
        }).filter(Boolean); // Remove rows with null values after preprocessing

    const mean = processedData.reduce((acc, row) => acc + row[columnName], 0) / data.length;
    const stdDev = Math.sqrt(processedData.reduce((acc, row) => acc + Math.pow(row[columnName] - mean, 2), 0) / data.length);

    return processedData.filter((row) => Math.abs(row[columnName] - mean) <= threshold * stdDev);
}
//----------------------------------------------------------------------------------------------------------------




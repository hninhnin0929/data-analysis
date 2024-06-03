### Compiling and Running
1. Compile the TypeScript code:
npx tsc

2. Run the compiled JavaScript code:
node dist/excel-export.js


### Filter Functions ###
### Date Range Filter:
export function filterByDateRange(data: any[], startDate: Date, endDate: Date) 
### Filters the data based on a date range

### Category Filter:
export function filterByCategory(data: any[], columnName: string, category: string) 
### Filters the data based on a specific category in a given column.

### Threshold Filter:
export function filterByThreshold(data: any[], columnName: string, threshold: number) 
### Filters the data based on a threshold value in a given column.

### Frequency Filter:
export function filterByFrequency(data: any[], columnName: string, frequency: number) 
### Filters the data to include only entries that appear a certain number of times in a given column.

### Pattern Matching Filter:
export function filterByPattern(data: any[], columnName: string, pattern: string) 
Filters the data based on a pattern matching in a given column.

### Keyword and Scre Filter:
export function filterByKeywordScore(data: any[], columnName: string, keywords: Keyword[], minScore: number)

### Top N Filter:
export function getTopN(data: any[], columnName: string, n: number) 
### Filters the data to get the top N entries based on a value in a given column.

### Multi-Criteria Filter:
export function multiCriteriaFilter(data: any[], criteria: { column: string, value: any }[]) 
### Filters the data based on multiple criteria

### Outlier Detection Filter:
export function filterOutliers(data: any[], columnName: string, threshold: number) 
### Filters out data entries that are outliers based on a threshold number of standard deviations from the mean in a given column.
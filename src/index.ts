function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("World"));

// Clean data
// let cleanedData = cleanData(data);

// Apply filters
//  cleanedData = filterByDateRange(cleanedData, new Date('2023-01-01'), new Date('2023-12-31'));
//  cleanedData = filterByCategory(cleanedData, '업무', '특정업무');
//  cleanedData = filterByThreshold(cleanedData, '예산액(원)', 1000000000);
//  cleanedData = filterByFrequency(cleanedData, '발주기관', 3);
//  cleanedData = filterByPattern(cleanedData, '용역명', '특정패턴');
//  cleanedData = getTopN(cleanedData, '예산액(원)', 5);
//  cleanedData = multiCriteriaFilter(cleanedData, [
//      { column: '계약방법', value: '일반경쟁' },
//      { column: '조달방식', value: '자체조달' }
//  ]);
//  cleanedData = filterOutliers(cleanedData, '예산액(원)', 2);

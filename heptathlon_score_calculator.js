import { readFile } from 'fs/promises';

const main = async () => {
  const csvFilePath = process.argv[2];
  const fileContentsInRows = await readInputFile(csvFilePath);
  const eventData = parseEventData(fileContentsInRows);

  console.log({ eventData });
};

// Read csv file and returns raw data
const readInputFile = async (filePath) => {
  try {
    const data = await readFile(filePath, 'utf8');
    return data.split('\n');
  } catch (err) {
    console.error('Error reading the file:', err);
    throw err;
  }
};

const parseEventData = (rowData) => {
  return rowData
    // Remove white space
    .filter((row) => row.trim() !== '')
    // Loop through and destructure each entry to a name variable
    .map((row) => {
      const [athlete, event, performance, dateTime] = row
        .split(',')
      // Return an array of objects with each object representing a row.   
      return {
        athlete: athlete.toLowerCase(), 
        event: event.toLowerCase(), 
        performance: performance.toLowerCase(), 
        dateTime: dateTime,
      };
    });
};

//Runs main function
main();

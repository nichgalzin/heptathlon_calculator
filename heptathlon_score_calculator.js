import { readFile } from 'fs/promises';

const main = async () => {
  const csvFilePath = process.argv[2];
  const fileContentsInRows = await readInputFile(csvFilePath);
  const eventData = parseEventData(fileContentsInRows);

  const eventDataWithScores = eventData.map((event) => {
    return calculateEventScore(event);
  });

  const structuredData = dataByDayAndAthlete(eventDataWithScores);

  outputData(structuredData);
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
  return (
    rowData
      // Remove white space
      .filter((row) => row.trim() !== '')
      // Loop through and destructure each entry to a named variable
      .map((row) => {
        const [athlete, event, performance, date] = row
          .split(',')
          .map((item) => item.trim());
        // Return an array of objects with each object representing a row.
        return {
          athlete: athlete.toLowerCase(),
          event: event.toLowerCase(),
          performance: parsePerformanceValue(performance),
          date: new Date(date.split(' ')[0]),
        };
      })
  );
};

const parsePerformanceValue = (performance) => {
  // Checks if performance is in minute:second format and converst to seconds
  if (performance.includes(':')) {
    const [minutes, seconds] = performance.split(':').map(parseFloat);
    return minutes * 60 + seconds;
  } else {
    // Parses other formats to floating point number and strips units
    return parseFloat(performance);
  }
};

const eventScoreCalculators = {
  '200m': (performance) => Math.floor(4.99087 * (42.5 - performance) ** 1.81),
  '800m': (performance) => Math.floor(0.11193 * (254 - performance) ** 1.88),
  '100m': (performance) => Math.floor(9.23076 * (26.7 - performance) ** 1.835),
  high: (performance) =>
    Math.floor(1.84523 * (performance * 100 - 75.0) ** 1.348),
  long: (performance) =>
    Math.floor(0.188807 * (performance * 100 - 210) ** 1.41),
  shot: (performance) => Math.floor(56.0211 * (performance - 1.5) ** 1.05),
  javelin: (performance) => Math.floor(15.9803 * (performance - 3.8) ** 1.04),
};

const calculateEventScore = (eventObj) => {
  const calculator = eventScoreCalculators[eventObj.event];
  if (calculator) {
    return {
      ...eventObj,
      score: calculator(eventObj.performance),
    };
  } else {
    console.log('Event not recognized');
    return 0;
  }
};

const formatDate = (date) => {
  return date.toLocaleDateString('en-UK', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

const dataByDayAndAthlete = (eventData) => {
  const structuredData = {};
  const sortedByDate = eventData.sort((a, b) => a.data - b.date);

  sortedByDate.forEach(({ date, athlete, event, score }) => {
    const dateKey = formatDate(date);

    if (!structuredData[dateKey]) {
      structuredData[dateKey] = {};
    }

    if (!structuredData[dateKey][athlete]) {
      structuredData[dateKey][athlete] = {};
    }

    structuredData[dateKey][athlete][event] = score;
  });
  return structuredData;
};

//Runs main function
main();

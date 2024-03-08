const fs = require('fs');
const csvFilePath = process.argv[2];

//Main function to calculate score
const heptathlonScoreCalculator = () => {
  readCSVFile(csvFilePath);
};

// Read csv file and returns raw data
const readCSVFile = (filePath) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    return data;
  });
};

//Runs main function
heptathlonScoreCalculator();

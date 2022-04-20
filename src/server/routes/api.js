const express = require("express");
const prsfile = require("../ProcessFile")
const router = express.Router();
const multer = require('multer')
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require('fs');
const Papa = require('papaparse');
const csv = require('csv-parser');
const csvToJson = require('convert-csv-to-json');
const repFirstLine = require('file-firstline-replace');
const path = require('path');
const rl = require("readline");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
//const dateFormat = require('dateformat');
const moment = require('moment');
const fsPromises = fs.promises;
const util = require('util');





const configFileName = "Config.json";
const historyFileName = "History.json";

const inputCsvJsonToFormat = [];
const inputCsvJson = [];
let modifiedCsvJson = [];
let modifiedCsvJsonToFormat = [];
let headersArray = [];

let newHeaders = "[";
let sourceHeaderNames = "";
let targetHeaderNames = "";
let sourceFieldsTypes = "";
let targetFieldsTypes = [];
let targetFieldsNames = [];

router.use(cors());
router.use(fileupload());
router.use(express.static("files"));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//api end point for the config file
router.post("/configupload", (req, res) => {

  const newpath = __dirname + "/files/";
  const file = req.files.file;
  const filename = configFileName; //file.name;
  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log('error');
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    console.log('succeed');
    res.status(200).send({ message: "File Uploaded", code: 200 });
    //ProcessCsv(`${newpath}${filename}`);
    ProcessConfigFile(`${newpath}${filename}`);
  });
});


//api end point for the data file
router.post("/dataupload", (req, res) => {

  const newpath = __dirname + "/files/";
  const file = req.files.file;
  const filename = file.name;
  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log('error');
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    console.log('succeed');
    res.status(200).send({ message: "File Uploaded", code: 200 });

    ProcessConfigFile(`${newpath}${configFileName}`);
    ReOrderColumns(`${newpath}${filename}`);
    AddRowToHistoryJson(file.name);
  });
});

router.post("/upload", (req, res) => {

  const newpath = __dirname + "/files/";
  const file = req.files.file;
  const filename = file.name;
  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log('error');
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    console.log('succeed');
    res.status(200).send({ message: "File Uploaded", code: 200 });
    ProcessCsv(`${newpath}${filename}`);
  });
});


function ProcessConfigFile(filename) {
  let rawdata = fs.readFileSync(filename);
  let configData = JSON.parse(rawdata);
  let sourceHeadersArray = [];
  let orderedHeadersArray = [];
  let sHeadersIndex = 0;

  //Concat the target header names
  targetHeaderNames = "";
  targetHeaders = configData.TargetColumnHeader;
  targetHeaders.forEach(function (tHeader) {
    targetHeaderNames += tHeader.Column + ',';
  });
  targetHeaderNames = targetHeaderNames.substring(0, targetHeaderNames.length - 1);


  targetColumnOrders = configData.TargetColumnOrder;
  sourceHeaders = configData.SourceColumnHeader;
  var nbOfColumns = configData.SourceColumnHeader.length;

  sourceHeaderNames = "";
  sourceHeaders.forEach(function (sHeader) {
    sourceHeadersArray[sHeadersIndex] = sHeader.Column;
    sHeadersIndex++;
  });


  let i = 0;
  targetColumnOrders.forEach(function (tOrder) {
    var order = parseInt(tOrder.Order);
    orderedHeadersArray[i] = sourceHeadersArray[order - 1];
    i++;
  });

  for (let i = 0; i < orderedHeadersArray.length; i++) {
    newHeaders += '"' + orderedHeadersArray[i] + '",';
    sourceHeaderNames += orderedHeadersArray[i] + ',';
  }

  newHeaders = newHeaders.substring(0, newHeaders.length - 1);
  newHeaders += "]";
  sourceHeaderNames = sourceHeaderNames.substring(0, sourceHeaderNames.length - 1);

  console.log(sourceHeaderNames);
}

function ProcessCsv(filename) {
  newHeaders = "[";

  let rawdata = fs.readFileSync(filename);
  let configData = JSON.parse(rawdata);


  console.log(configData.SourceColumnHeader);
  sourceHeaders = configData.SourceColumnHeader;
  sourceHeaders.forEach(function (sHeader) {
    var headerName = sHeader.Column;
    newHeaders += '"' + headerName + '",';
    console.log(headerName);
  });

  newHeaders = newHeaders.substring(0, newHeaders.length - 1);
  newHeaders += "]";

  console.log(configData.SourceColumnType);
  sourceTypes = configData.SourceColumnType;
  sourceTypes.forEach(function (type) {
    var typeName = type.Type;
    console.log(typeName);
  });

  console.log(newHeaders);

}


async function ReOrderColumns(filename, dataFileFullNameResult) {
  const results = [];
  console.log('reading the data file before reordering columns');
  console.log(filename);
  fs.createReadStream(filename)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
    });

  let abc = csvToJson.fieldDelimiter(',').getJsonFromCsv(filename);

  var orderedddata = Papa.unparse({
    fields: newHeaders,
    data: abc
  });

  console.log('writing the columns in the new order');
  await fs.writeFileSync(dataFileFullNameResult, orderedddata);

  console.log(newHeaders);


  var data = await fsPromises.readFile(dataFileFullNameResult, 'utf8');
  var result = data.replace(sourceHeaderNames, targetHeaderNames);
  await fsPromises.writeFile(dataFileFullNameResult, result);


  //Replace the first line, it means changing the headers to the new headers
  // await fs.readFile(dataFileFullNameResult, 'utf8', async function (err, data) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   console.log('replace the old headers with the new headers');
  //   var result = data.replace(sourceHeaderNames, targetHeaderNames);

  //   //console.log(result);
  //   console.log('write the new headers to the file');

  //   // await util.promisify(fs.writeFile(dataFileFullNameResult, result, 'utf8', async function (err) {
  //   //   if (err) return console.log(err);
  //   // }));

  //   await fsPromises.writeFile(dataFileFullNameResult, result);

  // });

  // await sleep(1000)
  // function sleep(ms) {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, ms);
  //   });
  // }

  // fs.readFile(dataFileFullNameResult, 'utf8', async function (err, data) {
  //   console.log('TEST PRINTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
  //   console.log(data);
  // });


}


/* GET users listing. */
router.get("/users", function (req, res, next) {
  console.log('get "users" route hit');
  res.send({ users: ["joe", "bernie", "tulsi", "donald", "bill"] });
});

router.get("/testapi", function (req, res, next) {
  res.json({ message: "Hello from server!" });
});

router.post('/testpost', function (req, res, next) {
  s = prsfile.sum(2, 5);
  b = JSON.stringify(req.body)
  res.send('you sent ' + b + s);
  console.log('you sent ' + b + s);
});

router.post("/testfileupload", (req, res) => {

  const newpath = __dirname + "/files/data/";
  const file = req.files.file;
  const filename = file.name; //file.name;
  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log('error');
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    console.log('succeed');
    res.status(200).send({ message: "File Uploaded", code: 200 });
  });
});

router.post("/testconfigfileupload", (req, res) => {

  const newpath = __dirname + "/files/configs/";
  const file = req.files.file;
  const filename = file.name; //file.name;
  file.mv(`${newpath}${filename}`, (err) => {
    if (err) {
      console.log('error');
      res.status(500).send({ message: "File upload failed", code: 200 });
    }
    console.log('succeed');
    res.status(200).send({ message: "File Uploaded", code: 200 });
  });
});


/* GET config file listing. */
router.get("/users", function (req, res, next) {
  console.log('get "users" route hit');
  res.send({ users: ["joe", "bernie", "tulsi", "donald", "bill"] });
});

async function AddRowToHistoryJson(shortFileName) {
  const filename = __dirname + "/files/" + historyFileName;
  const configfilename = __dirname + "/files/" + configFileName;
  var configData = "";

  console.log(filename);
  try {
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '{"History":[]}');
    }
  } catch (err) {
    console.error(err)
  }

  console.log(configfilename);
  if (fs.existsSync(configfilename)) {
    await fs.readFile(configfilename, function (err, data) {
      var json = JSON.parse(data)
      configData = json;
      console.log(err);
    })
  }

  fs.readFile(filename, function (err, data) {
    var json = JSON.parse(data)
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const nbOfLines = json['History'].length


    json['History'].push({ "id": nbOfLines + 1, "fileName": shortFileName, "timeStamp": currentDate, "settings": JSON.stringify(configData) });

    fs.writeFileSync(filename, JSON.stringify(json))
  })

}

router.get("/history", function (req, res, next) {
  const filename = __dirname + "/files/" + historyFileName;
  console.log(filename)
  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, '{"History":[]}');
  }
  fs.readFile(filename, function (err, data) {
    var json = JSON.parse(data)
    res.json(json);
    //console.log(json)
  })
});

router.get("/allconfigfiles", function (req, res, next) {
  const directoryPath = path.join(__dirname, 'files/configs');
  console.log(directoryPath);
  var allfiles = '[';
  //passsing directoryPath and callback function
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    if (files.length > 0) {
      //listing all files using forEach
      files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file)
        allfiles += '"' + file + '",';
      });
      allfiles = allfiles.substring(0, allfiles.length - 1);
    }

    allfiles += "]";
    res.send(allfiles);
    console.log(allfiles);
  });
});


router.post('/resultfile', async function (req, res, next) {

  b = JSON.stringify(req.body);
  console.log(b);
  var filenamesstring = b.substring(2, b.lastIndexOf('csv') + 3);
  var filenames = filenamesstring.split('###');
  var configfilename = filenames[0];
  var datafilename = filenames[1];

  const configFileFullName = path.join(__dirname, 'files/configs', configfilename);
  const dataFileFullName = path.join(__dirname, 'files/data', datafilename);
  var resultfileshortname = datafilename.substring(0, datafilename.length - 4);
  const dataFileFullNameResult = path.join(__dirname, 'files/data', resultfileshortname + '-result.csv');

  console.log(dataFileFullNameResult);
  await ProcessConfigFileNew(configFileFullName, dataFileFullName);
  await ReOrderColumns(dataFileFullName, dataFileFullNameResult);
  await AddRowToHistoryJsonNew(datafilename, configfilename, resultfileshortname + '-result.csv');

  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

  // await sleep(1000)
  // function sleep(ms) {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, ms);
  //   });
  // }


  var newFieldsJson = [];
  for (let i = 1; i < targetFieldsNames.length; i++) {
    console.log(targetFieldsNames[i]);
    newFieldsJson.push({ id: targetFieldsNames[i], title: targetFieldsNames[i] });
  }

  console.log(dataFileFullNameResult);
  const csvWriter = createCsvWriter({
    path: dataFileFullNameResult,
    header: newFieldsJson,
    alwaysQuote: false,
  });

  fs.createReadStream(dataFileFullNameResult)
    .pipe(csv())
    .on('data', (data) => inputCsvJsonToFormat.push(data))
    .on('end', async () => {
      modifiedCsvJsonToFormat = inputCsvJsonToFormat

      console.log('...Done');
      // console.log(modifiedCsvJsonToFormat);

      // modifiedCsvJsonToFormat = modifiedCsvJsonToFormat.map((item) => {
      //   const returnedItem = item
      //   const itemKey = 'Date';
      //   returnedItem[itemKey] = moment(item[itemKey]).format('D-MMM-YY');
      //   return returnedItem
      // })

      for (let i = 1; i < targetFieldsTypes.length; i++) {
        console.log(targetFieldsTypes[i]);
        modifiedCsvJsonToFormat = modifiedCsvJsonToFormat.map((item) => {
          const returnedItem = item
          const itemKey = targetFieldsNames[i];
          if (targetFieldsTypes[i] === 'Text') {
            returnedItem[itemKey] = "'" + item[itemKey] + "'";
          }
          else if (targetFieldsTypes[i].includes('Y') || targetFieldsTypes[i].includes('y')) {
            //console.log(item[itemKey]);
            returnedItem[itemKey] = moment(item[itemKey]).format(targetFieldsTypes[i]);
            //returnedItem[itemKey] = moment(item[itemKey],targetFieldsTypes[i]);
            //returnedItem[itemKey] = item[itemKey];
          }
          else {
            returnedItem[itemKey] = item[itemKey];
          }
          return returnedItem
        })
      }

      csvWriter.writeRecords(modifiedCsvJsonToFormat)
        .then(() => {
          console.log('The CSV file (TO FORMAT) was written successfully!')

          console.log('...Finished!');
        });

    });


  //await ProcessConfigFileNewMethod(configFileFullName, dataFileFullName, dataFileFullNameResult)
  //ChangeFieldsTypes(datafilename)
  res.status(200).send({ message: "File processed succefully", code: 200 });


});

function ProcessConfigFileNew(filename) {
  var results = [];
  var data = fs.readFileSync(filename, "utf8")
  data = data.split("\r\n")

  sourceFieldsTypes = data[1];
  // targetFieldsTypes = data[6];
  // targetFieldsNames = data[5];

  for (let i = 0; i < data.length; i++) {
    results[i] = data[i].split(",");
  }

  targetFieldsTypes = results[6];
  targetFieldsNames = results[5];

  var sourceHeadersArray = [];
  for (let i = 1; i < results[0].length; i++) {
    sourceHeadersArray[i - 1] = results[0][i];
  }

  targetHeaderNames = data[5].substring(data[5].indexOf(',') + 1);

  var targetColumnOrders = [];
  for (let i = 1; i < results[4].length; i++) {
    targetColumnOrders[i - 1] = results[4][i];
  }

  var i = 0;
  var orderedHeadersArray = [];
  targetColumnOrders.forEach(function (tOrder) {
    var order = parseInt(tOrder);
    orderedHeadersArray[i] = sourceHeadersArray[order - 1];
    i++;
  });


  for (let i = 0; i < orderedHeadersArray.length; i++) {
    newHeaders += '"' + orderedHeadersArray[i] + '",';
    sourceHeaderNames += orderedHeadersArray[i] + ',';
  }

  newHeaders = newHeaders.substring(0, newHeaders.length - 1);
  newHeaders += "]";
  sourceHeaderNames = sourceHeaderNames.substring(0, sourceHeaderNames.length - 1);


  console.log('END ProcessConfigFileNew')
}


router.post("/downloadfile", async function (req, res, next) {
  console.log('enter download method');
  b = JSON.stringify(req.body)
  file = b.substring(2, b.lastIndexOf('csv') + 3);
  fileLocation = path.join(__dirname, 'files/data', file);
  console.log(fileLocation);
  console.log(file);
  var data = await fsPromises.readFile(fileLocation, 'utf8');
  res.download(fileLocation, file, (err) => {
    if (err) console.log(err);
    else {
      console.log('download succeeded');
    }

  });
});

router.post("/downloadconfigfile", function (req, res, next) {
  console.log('enter download method');
  b = JSON.stringify(req.body)
  file = b.substring(2, b.lastIndexOf('csv') + 3);
  fileLocation = path.join(__dirname, 'files/configs', file);
  console.log(fileLocation);
  console.log(file);
  res.download(fileLocation, file, (err) => {
    if (err) console.log(err);
    else {
      console.log('download succeeded');
    }

  });
});


async function AddRowToHistoryJsonNew(dataFileName, configFileName, resultfileshortname) {
  console.log('enter AddRowToHistoryJsonNew method');
  const filename = __dirname + "/files/" + historyFileName;

  console.log(filename);
  try {
    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '{"History":[]}');
    }
  } catch (err) {
    console.error(err)
  }

  fs.readFile(filename, function (err, data) {
    var json = JSON.parse(data)
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    const nbOfLines = json['History'].length


    json['History'].push({ "id": nbOfLines + 1, "fileName": dataFileName, "resultfile": resultfileshortname, "configfile": configFileName, "timeStamp": currentDate });

    fs.writeFileSync(filename, JSON.stringify(json))
  })

  console.log('END AddRowToHistoryJsonNew method');
}

async function ChangeFieldsTypes(dataFileName) {
  console.log('enter ChangeFieldsTypes method');
  console.log(dataFileName);

  try {
    if (fs.existsSync(dataFileName)) {
      fs.readFile(dataFileName, function (err, data) {
        var json = JSON.parse(data)
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const nbOfLines = json['History'].length


        json['History'].push({ "id": nbOfLines + 1, "fileName": dataFileName, "resultfile": dataFileName, "configfile": configFileName, "timeStamp": currentDate });

        fs.writeFileSync(filename, JSON.stringify(json))
      })
    }
  } catch (err) {
    console.error(err)
  }
}


async function ProcessConfigFileNewMethod(configfile, dataFileFullName, dataResultFile) {
  console.log('------------------------------------------------------------------');
  console.log('START ProcessConfigFileNewMethod');
  var results = [];
  var data = fs.readFileSync(configfile, "utf8")
  data = data.split("\r\n")

  for (let i = 0; i < data.length; i++) {
    results[i] = data[i].split(",");
  }

  targetFieldsTypes = results[6];
  targetFieldsNames = results[5];

  var sourceHeadersArray = [];
  for (let i = 1; i < results[0].length; i++) {
    sourceHeadersArray[i - 1] = results[0][i];
  }

  targetHeaderNames = data[5].substring(data[5].indexOf(',') + 1);

  var targetColumnOrders = [];
  for (let i = 1; i < results[4].length; i++) {
    targetColumnOrders[i - 1] = results[4][i];
  }

  var i = 0;
  var orderedHeadersArray = [];
  targetColumnOrders.forEach(function (tOrder) {
    var order = parseInt(tOrder);
    orderedHeadersArray[i] = sourceHeadersArray[order - 1];
    i++;
  });


  //New method to order directly
  var oldNewFieldsJson = [];
  for (let i = 0; i < orderedHeadersArray.length; i++) {
    oldNewFieldsJson.push({ id: orderedHeadersArray[i], title: results[5][i + 1] });
  }
  console.log(oldNewFieldsJson);

  //New method to change format directly
  var newFieldsJson = [];
  for (let i = 1; i < targetFieldsTypes.length; i++) {
    console.log(results[5][i]);
    newFieldsJson.push({ id: results[5][i], title: results[5][i] });
  }

  const csvWriter = createCsvWriter({
    path: dataResultFile,
    header: oldNewFieldsJson,
    alwaysQuote: false,
  });

  // const csvWriterToChangeFormat = createCsvWriter({
  //   path: dataResultFile,
  //   header: newFieldsJson,
  //   alwaysQuote: false,
  // });

  await ReorderNewMethod(dataFileFullName, csvWriter, dataResultFile, newFieldsJson);
  // await FormatNewMethod(dataResultFile, csvWriterToChangeFormat);

  console.log('END ProcessConfigFileNewMethod');
  console.log('------------------------------------------------------------------');
}

async function ReorderNewMethod(dataFileFullName, csvWriter, dataResultFile, newFieldsJson) {
  console.log('Initiating TO REORDER...');
  console.log(`Preparing to parse CSV file TO REORDER... ${dataFileFullName}`);

  await fs.createReadStream(dataFileFullName)
    .pipe(csv())
    .on('data', (data) => inputCsvJson.push(data))
    .on('end', async () => {
      modifiedCsvJson = inputCsvJson

      console.log('...Done REORDERING');

      await writeDataToFileToOrderColumns(csvWriter);
    });

  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  const csvWriterToChangeFormat = createCsvWriter({
    path: dataResultFile,
    header: newFieldsJson,
    alwaysQuote: false,
  });

  await sleep(1000)
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  await FormatNewMethod(dataResultFile, csvWriterToChangeFormat);
}


async function FormatNewMethod(dataResultFile, csvWriterToChangeFormat) {
  console.log('Initiating...');
  console.log(`Preparing to parse CSV file... ${dataResultFile}`);


  fs.createReadStream(dataResultFile)
    .pipe(csv())
    .on('data', (data) => inputCsvJsonToFormat.push(data))
    .on('end', async () => {
      modifiedCsvJsonToFormat = inputCsvJsonToFormat

      console.log('...Done');

      await modifyFormat();
      await writeDataToFileToChangeTypes(csvWriterToChangeFormat);
    });
}

/**
 * Execute functions once data is available.
 */
function initFunctions(csvWriter) {
  console.log('Initiating script functionality...');

  //modifyCertifiedUnits();
  //filterAlbumYears();

  /**
   * Once everything is finished, write to file.
   */
  //writeDataToFile(csvWriter);
}

/**
 * Function that will remove items that don't match our desired years.
 */
function filterAlbumYears() {
  console.log('Removing items released in 2015');

  modifiedCsvJson = modifiedCsvJson.filter((item) => {
    return item['column_c'] === 'Car' ? null : item
  });

  console.log('...Done');
}

/**
 * Removes the parenthesis from the 'Certified Units' field.
 */
async function modifyFormat() {
  console.log('Formating the file...')

  for (let i = 1; i < targetFieldsTypes.length; i++) {
    modifiedCsvJsonToFormat = modifiedCsvJsonToFormat.map((item) => {
      const returnedItem = item
      const itemKey = targetFieldsNames[i];
      // console.log(targetFieldsTypes.length);
      // console.log(itemKey);
      if (targetFieldsTypes[i] === 'Text') {
        returnedItem[itemKey] = "'" + item[itemKey] + "'";
      }
      else if (targetFieldsTypes[i].includes('Y') || targetFieldsTypes[i].includes('y')) {
        returnedItem[itemKey] = moment(item[itemKey]).format(targetFieldsTypes[i]);
      }
      else {
        returnedItem[itemKey] = item[itemKey];
      }

      //returnedItem[itemKey] = item[itemKey].replace(/"/g, '');
      //returnedItem[itemKey] = "'" +  item[itemKey] + "'";
      // console.log(item['Vessel Type']);
      // returnedItem[3] = moment(item[3]).format('D-MMM-YY');
      return returnedItem
    })
  }



  console.log('...Done');
}


/**
 * Write all modified data to its own CSV file to order columns.
 */
async function writeDataToFileToOrderColumns(csvWriter) {
  console.log(`Writing data to a file to reorder...`);

  csvWriter.writeRecords(modifiedCsvJson)
    .then(() => {
      console.log('The CSV file (TO REORDER) was written successfully!')

      console.log('...Finished!');
    });
}

async function writeDataToFileToChangeTypes(csvWriterToChangeFormat) {
  console.log(`Writing data to a file...`);

  csvWriterToChangeFormat.writeRecords(modifiedCsvJsonToFormat)
    .then(() => {
      console.log('The CSV file (TO FORMAT) was written successfully!')

      console.log('...Finished!');
    });
}

module.exports = router;

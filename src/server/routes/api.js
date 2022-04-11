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
const rl = require("readline")

const configFileName = "Config.json";
const historyFileName = "History.json";
let newHeaders = "[";
let sourceHeaderNames = "";
let targetHeaderNames = "";

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


function ReOrderColumns(filename) {
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
  fs.writeFileSync(filename, orderedddata);

  console.log(newHeaders);


  //Replace the first line, it means changing the headers to the new headers
  fs.readFile(filename, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    console.log('replace the old headers with the new headers');
    var result = data.replace(sourceHeaderNames, targetHeaderNames);

    console.log('write the new headers to the file');
    fs.writeFile(filename, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });


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


router.post('/resultfile', function (req, res, next) {

  b = JSON.stringify(req.body);
  console.log(b);
  var filenamesstring = b.substring(2, b.lastIndexOf('csv') + 3);
  var filenames = filenamesstring.split('###');
  var configfilename = filenames[0];
  var datafilename = filenames[1];

  const configFileFullName = path.join(__dirname, 'files/configs', configfilename);
  const dataFileFullName = path.join(__dirname, 'files/data', datafilename);

  ProcessConfigFileNew(configFileFullName);
  ReOrderColumns(dataFileFullName);
  AddRowToHistoryJsonNew(datafilename, configfilename);

  res.status(200).send({ message: "File processed succefully", code: 200 });


});

function ProcessConfigFileNew(filename) {
  var results = [];
  var data = fs.readFileSync(filename, "utf8")
  data = data.split("\r\n")
  for (let i = 0; i < data.length; i++) {
    results[i] = data[i].split(",");
  }

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


router.post("/downloadfile", function (req, res, next) {
  console.log('enter download method');
  b = JSON.stringify(req.body)
  file = b.substring(2, b.lastIndexOf('csv') + 3);
  fileLocation = path.join(__dirname, 'files/data', file);
  console.log(fileLocation);
  console.log(file);
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


async function AddRowToHistoryJsonNew(dataFileName, configFileName) {
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


    json['History'].push({ "id": nbOfLines + 1, "fileName": dataFileName, "resultfile": dataFileName, "configfile": configFileName, "timeStamp": currentDate });

    fs.writeFileSync(filename, JSON.stringify(json))
  })

}

module.exports = router;

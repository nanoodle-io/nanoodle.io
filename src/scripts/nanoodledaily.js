require('dotenv').config()

const cron = require("node-cron");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//buffer
global.Buffer = global.Buffer || require('buffer').Buffer;

if (typeof btoa === 'undefined') {
    global.btoa = function (str) {
        return Buffer.from(str, 'binary').toString('base64');
    };
}

if (typeof atob === 'undefined') {
    global.atob = function (b64Encoded) {
        return Buffer.from(b64Encoded, 'base64').toString('binary');
    };
}

var port = "8082";
//reusable variables
var nowDate;
var paramDate;
//new blocks
var results;
var response;

var transactions;
var rawTotal;
var nanoMicro;
var nanoSmall;
var nanoNormal;
var nanoLarge;

const Http = new XMLHttpRequest();

// sending emails at periodic intervals
cron.schedule("10 0 * * *", function () {
    //console.log(Date.now() + ": running BI daily for Nano Live!");

    //initial query date
    nowDate = new Date();
    //last 24 hours
    paramDate = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000);

    response = [];
    
transactions = 0;
rawTotal = 0;
nanoMicro = 0;
nanoSmall = 0;
nanoNormal = 0;
nanoLarge = 0;

    //dev 8080 vs ops 8082
    let initialURL = 'http://localhost:' + port + '/core/reporting?filter={"log.epochTimeStamp":{$gt: new Date(' + paramDate.getTime() + ')}}&np'

    let pageHttp = new XMLHttpRequest();    
    pageHttp.open("GET", initialURL, true);
    pageHttp.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
    pageHttp.setRequestHeader("Content-Type'", "application/json");
    pageHttp.send();

    pageHttp.onreadystatechange = function () {
        if (pageHttp.readyState == 4 && pageHttp.status == 200) {
            try {
                response = JSON.parse(pageHttp.responseText);
}
                catch (err) {
                    console.log("error in response caught..." + err);
                }
   for (var i = 0; i < response.length; i++) {
                   	transactions = transactions + response[i].transactions;
			rawTotal = rawTotal + response[i].rawTotal;
			nanoMicro = nanoMicro + response[i].nanoMicro;
			nanoSmall = nanoSmall + response[i].nanoSmall;
			nanoNormal = nanoNormal + response[i].nanoNormal;
			nanoLarge = nanoLarge + response[i].nanoLarge;
                };
results = "{dailyTransactions : " + transactions + ", dailyRaw : " + rawTotal + ",dailyMicro : " + nanoMicro + ",dailySmall : " + nanoSmall + ",dailyNormal : " + nanoNormal + ",dailyLarge : " + nanoLarge + "}";
createRecord(results);
}
        }
    });

function createRecord(body) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "http://localhost:" + port + "/core/reportingDay");
        xhr.setRequestHeader("Content-Type", "application/json");
    	xhr.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));

        xhr.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (xhr.status == 201) {
                // Resolve the promise with the response text
                resolve(xhr.statusText);
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(xhr.statusText));
            }
        };

        // Handle network errors
        xhr.onerror = function () {
            reject(Error("Network Error"));
        };

        // Make the request
        xhr.send(body);
    });
}

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

const Http = new XMLHttpRequest();
//8082 prod
const priceUrl = 'http://localhost:8082/core/price'
const cryptoCompareUrl = 'https://min-api.cryptocompare.com/data/price?fsym=NANO&tsyms=BTC,ETH,USD,EUR,JPY,NGN,GHS,TRY,VND,INR,GBP,CHF,CAD,AUD,ZAR,CNY,MXN,BRL,VES,SEK,COP,PEN,ARS&extraParams=nanoodle.io&api_key=' + process.env.CRYPTOCOMPARE_KEY;
var response;

// checking price
cron.schedule("* * * * *", function () {
	getPrice().then(data => {
		response = JSON.stringify(data);
		createPriceRecord(response).then(data => {
		}
		);
	});
});

function createPriceRecord(body) {

    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', priceUrl );
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

function getPrice() {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", cryptoCompareUrl);
        xhr.setRequestHeader("Content-Type'", "application/json");
        xhr.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (xhr.status == 200) {
                // Resolve the promise with the response text
                //console.log(xhr.responseText);
                resolve(JSON.parse(xhr.responseText));
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
        xhr.send();
    });
}

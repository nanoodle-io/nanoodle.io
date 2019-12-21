require('dotenv').config()
var Twitter = require('/root/scripts/node_modules/twitter');
var twitterConfig = require('/root/scripts/twitterConfig.js');
var twitterClient = new Twitter(twitterConfig);

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
const networkSnapshotUrl = 'http://localhost:8082/core/networkSnapshot'
const nanotickerUrl = 'https://nanoticker.info/json/stats.json';
const lastNetworkSnapshotUrl = 'http://localhost:8082/core/networkSnapshot?pagesize=1&np';
var response;
var lastCount;
var currentCount;
var blockDifference;
var lastAlert;

const highThreshold = 2;
const lowThreshold = 1;
const minutes = 10;

// checking nanoticker stats
getStats(false).then(data => {
	lastCount = +data[0]['blockCountMedian'];
	lastAlert = data[0]['nanoodleAlert'];
	getStats(true).then(data => {
		response = data;
		currentCount = +response['blockCountMedian'];
		blockDifference = currentCount - lastCount;
		
		response['nanoodleBPSDifference'] = blockDifference / (60 * minutes);
		response['nanoodleAlert'] = lastAlert;
		
		if (+response['nanoodleBPSDifference'] > highThreshold)
		{
			if (!lastAlert)
                        {

try {
                                    console.log("Twitter Alert");
                                    twitterClient.post('statuses/update', { status: "High $Nano transaction rate detected over the last " + minutes + " minutes." });
                                }
                                catch (err) {
                                    console.log(err);
                                }
                        }
			response['nanoodleAlert'] = true;
		}
		else if (+response['nanoodleBPSDifference'] < lowThreshold)
                {
			response['nanoodleAlert'] = false;
                }

		response = JSON.stringify(response);
		console.log(response);
		createNetworkSnapshotRecord(response).then(data => {
		}
		);
	});
});

function createNetworkSnapshotRecord(body) {

    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', networkSnapshotUrl );
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

function getStats(future) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
	if (future)
	{
        	xhr.open("GET", nanotickerUrl);
	}
	else
	{
		xhr.open("GET", lastNetworkSnapshotUrl);
	        xhr.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
	} 
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

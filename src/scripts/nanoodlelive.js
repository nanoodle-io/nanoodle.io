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
var key;
//block information
var contents;
var summary;
var nanoTotal;
var nanoTrx;
var BTC;
var ETH;
var USD;
var EUR;
var JPY;
var GBP;
var CHF;
var CAD;
var AUD;
var ZAR;
var CNY;
var MXN;
var BRL;
var VES;
var SEK;
var COP;
var PEN;
var ARS;
var pages;
var maxMicro = 0;
var maxSmall = 0;
var maxNormal = 0;
var nanoMicro = 0;
var nanoSmall = 0;
var nanoNormal = 0;
var nanoLarge = 0;
var pageSize = 200;

const Http = new XMLHttpRequest();

//node port stays the same
const nodeUrl = 'http://localhost:7076'

// sending emails at periodic intervals
cron.schedule("0 * * * *", function () {
    //console.log(Date.now() + ": running BI daily for Nano Live!");

    //initial query date
    nowDate = new Date();
    //last 24 hours
    paramDate = new Date(nowDate.getTime() - 60 * 60 * 1000);

    //summary
    nanoTotal = 0;
    nanoTrx = 0;

    //types
    nanoMicro = 0;
    nanoSmall = 0;
    nanoNormal = 0;
    nanoLarge = 0;
    maxMicro = 0;
    maxNormal = 0;
    maxSmall = 0;

    //get new blocks
    results = [];
    response = [];
    key = [];

    BTC = 0;
    ETH = 0;
    USD = 0;
    EUR = 0;
    JPY = 0;
    GBP = 0;
    CHF = 0;
    CAD = 0;
    AUD = 0;
    ZAR = 0;
    CNY = 0;
    MXN = 0;
    BRL = 0;
    VES = 0;
    SEK = 0;
    COP = 0;
    PEN = 0;
    ARS = 0;

    pages = 0;
    //dev 8080 vs ops 8082
    let initialURL = 'http://localhost:' + port + '/blocks/input?filter={"log.epochTimeStamp":{$gt: new Date(' + paramDate.getTime() + ')}}&filter={"is_send" : "true" }&keys={"hash" : 1 }&count&pagesize='+ pageSize + '&sort={"log.epochTimeStamp" : -1}'
    Http.open("GET", initialURL, true);
    Http.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
    Http.setRequestHeader("Content-Type'", "application/json");
    Http.send();

    Http.onreadystatechange = function () {
        if (Http.readyState == 4 && Http.status == 200) {
            try {
                getPrice().then(data => {
                    for (var x = 0; x < data.length; x++) {
                        BTC = BTC + data[x]['BTC'];
                        ETH = ETH + data[x]['ETH'];
                        USD = USD + data[x]['USD'];
                        EUR = EUR + data[x]['EUR'];
                        JPY = JPY + data[x]['JPY'];
                        GBP = GBP + data[x]['GBP'];
                        CHF = CHF + data[x]['CHF'];
                        CAD = CAD + data[x]['CAD'];
                        AUD = AUD + data[x]['AUD'];
                        ZAR = ZAR + data[x]['ZAR'];
                        CNY = CNY + data[x]['CNY'];
                        MXN = MXN + data[x]['MXN'];
                        BRL = BRL + data[x]['BRL'];
                        VES = VES + data[x]['VES'];
                        SEK = SEK + data[x]['SEK'];
                        COP = COP + data[x]['COP'];
                        PEN = PEN + data[x]['PEN'];
                        ARS = ARS + data[x]['ARS'];
                    }
                    BTC = BTC / data.length;
                    ETH = ETH / data.length;
                    USD = USD / data.length;
                    EUR = EUR / data.length;
                    JPY = JPY / data.length;
                    GBP = GBP / data.length;
                    CHF = CHF / data.length;
                    CAD = CAD / data.length;
                    AUD = AUD / data.length;
                    ZAR = ZAR / data.length;
                    CNY = CNY / data.length;
                    MXN = MXN / data.length;
                    BRL = BRL / data.length;
                    VES = VES / data.length;
                    SEK = SEK / data.length;
                    COP = COP / data.length;
                    PEN = PEN / data.length;
                    ARS = ARS / data.length;

                    //limits
                    maxMicro = 0.01 / USD * 1000000000000000000000000000000;
                    maxSmall = 1 / USD * 1000000000000000000000000000000;
		    maxNormal = 1000 / USD * 1000000000000000000000000000000;
                    //console.log(maxMicro);
                    //console.log(maxNormal);

                    response = JSON.parse(Http.responseText);
                    pages = +response['_total_pages'];
                    createMetricRecord(pages);
                });
            }
            catch (err) {
                //console.log("error in response caught..." + err);
            }
        }
    }
});

function createMetricRecord(page) {
    //console.log("Level: " + page);
    if (page == 0) {
        //final level get price make record
        let body = JSON.stringify({
            "transactions": nanoTrx,
            "rawTotal": nanoTotal,
            "nanoMicro": nanoMicro,
	    "nanoSmall": nanoSmall,
            "nanoNormal": nanoNormal,
            "nanoLarge": nanoLarge,
            "BTC": BTC,
            "ETH": ETH,
            "USD": USD,
            "EUR": EUR,
            "JPY": JPY,
            "GBP": GBP,
            "CHF": CHF,
            "CAD": CAD,
            "AUD": AUD,
            "ZAR": ZAR,
            "CNY": CNY,
            "MXN": MXN,
            "BRL": BRL,
            "VES": VES,
            "SEK": SEK,
            "COP": COP,
            "PEN": PEN,
            "ARS": ARS,
        });
        //console.log(body);
        createRecord(body);
    }
    else {
        //get new blocks
        results = [];
        response = [];
        key = [];

        //block information
        summary = [];
        contents = "";

        let queryURL = 'http://localhost:' + port + '/blocks/input?filter={"log.epochTimeStamp":{$gt: new Date(' + paramDate.getTime() + ')}}&filter={"is_send" : "true" }&keys={"hash" : 1 }&pagesize=' + pageSize + '&page=' + page + '&sort={"log.epochTimeStamp" : -1}&np'
        //console.log(queryURL);
        let pageHttp = new XMLHttpRequest();
        pageHttp.open("GET", queryURL, true);
        pageHttp.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
        pageHttp.setRequestHeader("Content-Type'", "application/json");
        pageHttp.send();

        pageHttp.onreadystatechange = function () {
            if (pageHttp.readyState == 4 && pageHttp.status == 200) {
                try {
                    response = JSON.parse(pageHttp.responseText);
                    //console.log(response);
                }
                catch (err) {
                  //  console.log("error in response caught..." + err);
                }

                for (var i = 0; i < response.length; i++) {
                    results.push(response[i].hash);
                }

                getBlockData(results).then(data => {
                    key = Object.keys(data['blocks']);

                    for (var x = 0; x < key.length; x++) {
                        summary = data['blocks'][key[x]];
                        contents = JSON.parse(formatContent(summary['contents']));

                        nanoTotal = nanoTotal + +summary['amount'];
                        nanoTrx = nanoTrx + 1;

                        if (+summary['amount'] < maxMicro)
                        {
                            nanoMicro++;
                        }
			else if (+summary['amount'] < maxSmall)
                        {
                            nanoSmall++;
                        }
                        else if (+summary['amount'] < maxNormal)
                        {
                            nanoNormal++;
                        }
                        else
                        {
                            nanoLarge++;
                        }
                    }
                    page--;
                    createMetricRecord(page);
                });
            }
        }
    }
}

function createRecord(body) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "http://localhost:" + port + "/core/reporting");
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
    //console.log(Date.now() + ": get price data.");

    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        priceURL = "http://localhost:" + port + "/core/price?filter={'log.epochTimeStamp':{$gte: new Date(" + paramDate.getTime() + ")}}&filter={'log.epochTimeStamp':{$lte: new Date(" + nowDate.getTime() + ")}}&np";

        xhr.open("GET", priceURL);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
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

function getBlockData(hashParam) {
    //console.log(Date.now() + ": get block data.");

    let body = JSON.stringify({
        "action": "blocks_info",
        "hashes": hashParam
    });

    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', nodeUrl);
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
        xhr.send(body);
    });
}

//RPC block results have a bunch of extra characters that need removing before a parse
function formatContent(jsonRepParam) {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
}

function formatAmount(mRai) {
    const dec = 6;
    const raw = 1000000000000000000000000000000;
    var temp = mRai / raw;
    return temp.toFixed(dec);
}

require('/root/scripts/node_modules/dotenv').config({ path: '/root/scripts/.env' })

var XMLHttpRequest = require("/root/scripts/node_modules/xmlhttprequest").XMLHttpRequest;
var nodemailer = require("/root/scripts/node_modules/nodemailer");
var Twitter = require('/root/scripts/node_modules/twitter');
var twitterConfig = require('/root/scripts/twitterConfig.js');
var twitterClient = new Twitter(twitterConfig);
var Discord = require('/root/scripts/node_modules/discord.js');

//buffer
global.Buffer = global.Buffer || require('/root/scripts/node_modules/buffer').Buffer;

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

//tracked accounts
var accountsTracked;
var unVerifiedAccountsTracked = [];
var minutes = 1;
var nowDate;
var paramDate;
var priceDate;
var contents;
var representative;
var old_representative;
var account;
var blockURL;
var marketURL;
var getBlockDataBody;
var mailOptions;
var transporter;
var currentAccount;
var alertChannel;
var start;
var from;
var to;
var usdRate;
var patchString;
var primaryAccount = {};
var primaryEmail = {};
var primaryKey = {};
var results = [];
var response = [];
var key = [];
var summary = [];
var aliasHash = {};
var i, x;
var temp;
const ninjaUrl = 'https://mynano.ninja/api/accounts/aliases'
const nodeUrl = 'http://localhost:7076'
const verifiedAccountUrl = 'http://localhost:8082/core/watch?filter={"verified": "2"}&pagesize=1000&np'
const unVerifiedaccountUrl = 'http://localhost:8082/core/watch?filter={"verified": "0" }&pagesize=1000&np'
const sentBody = JSON.stringify({
    "verified": "" + 1 + ""
});
const dec = 6;
const raw = 1000000000000000000000000000000;

// sending emails at periodic intervals
console.log("Running unverified email check");
getAccounts(unVerifiedaccountUrl).then(data => {
    unVerifiedAccountsTracked = data;
    for (x = 0; x < unVerifiedAccountsTracked.length; x++) {
        currentAccount = unVerifiedAccountsTracked[x];
        markSent(currentAccount['key']).then(function () {
            try {
                mailOptions = {
                    from: 'contact@nanoodle.io',
                    to: currentAccount['email'],
                    subject: `NANOODLE Watch: Verify Account`,
                    html: '<p>NANOODLE Watch requires verification of your email address to watch a Nano account and receive updates on any detected activity.</p><h2>Verification Link</h2><p>Please verify that you wish to watch the account by clicking <a href=\"https://nanoodle.io/verify/' + currentAccount['key'].toString() + '\">here</a>.</p><p>We will then send notifications for the account <a href="https://nanoodle.io/account/' + currentAccount['account'].toString() + '">' + currentAccount['account'].toString() + '</a></p>'
                };
                // create mail transporter
                transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.GOOGLE_USER,
                        pass: process.env.GOOGLE_PASSWORD
                    }
                });
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
                transporter.close();
            }
            catch (err) {
                console.log(err);
            }
        })
            //catch error from markset
            .catch(error => console.log(error));
    }
})
    //catch errors from account retrieval
    .catch(error => console.log(error));

// sending emails and tweetsƒ at periodic intervals
console.log("Running block scan");
//initial query date
nowDate = new Date();
paramDate = new Date(nowDate.getTime() - minutes * 60 * 1000);
priceDate = new Date(nowDate.getTime() - 3 * 60 * 1000);
primaryAccount = {};
primaryEmail = {};
primaryKey = {};
//get new blocks
results = [];
response = [];
key = [];
//block information
summary = [];
contents = "";
representative = "";
old_representative = "";

getNewBlocks().then(data => {
    response = data;
    if (response.length > 0) {
        getMarketPrice('USD').then(data => {
            usdRate = data[0]['USD'];
            getAccounts(verifiedAccountUrl).then(data => {
                accountsTracked = data;
                for (i = 0; i < accountsTracked.length; i++) {
                    primaryAccount[accountsTracked[i]['account']] = "";
                    primaryEmail[accountsTracked[i]['account']] = accountsTracked[i]['email'];
                    primaryKey[accountsTracked[i]['account']] = accountsTracked[i]['key'];
                }
                //get keys for block details
                for (i = 0; i < response.length; i++) {
                    results.push(response[i].hash);
                }
                getAlias().then(data => {
                    aliasHash = {};
                    for (i = 0; i < data.length; i++) {
                        aliasHash[data[i]['account']] = data[i]['alias'];
                    }
                    getBlockData(results).then(data => {
                        key = Object.keys(data['blocks']);
                        for (i = 0; i < key.length; i++) {
                            //breakout block content
                            keyValue = key[i];
                            summary = data['blocks'][keyValue];
                            contents = JSON.parse(formatContent(summary['contents']));
			    //find change blocks
			    if (summary.subtype == "change") {
if (+summary.balance >= 10000000000000000000000000000000000){
				//tweet if large delegation changes are detected
				start = 'NANOODLE Watch Decentralisation Alert 🎉 - ' + (+summary.balance / 1000000000000000000000000000000).toFixed() + ' $NANO redelegated';
				if (contents['representative'] in aliasHash) {
                                    representative  = ' to ' + aliasHash[contents['representative']];
                                }
				else
				{
				    representative = ' to ' + contents['representative'].substring(0, 12) + "...";
				}
let tempArray = [];
tempArray.push(contents.previous);
getBlockData(tempArray).then(data => {
                            //breakout block content
summary = data['blocks'][contents.previous];
                            contents = JSON.parse(formatContent(summary['contents']));


if (contents['representative'] in aliasHash) {
                                    old_representative  = ' from ' + aliasHash[contents['representative']];
                                }
                                else
                                {
                                    old_representative = ' from ' + contents['representative'].substring(0, 12) + "...";
                                }
				try {
                                    console.log("Twitter Alert");
                                    twitterClient.post('statuses/update', { status: start + old_representative + representative + ' - https://nanoodle.io/block/' + keyValue });
                                }
                                catch (err) {
                                    console.log(err);
                                }
});
}
			    }
                            //if large enough, post message
                            else if (summary.subtype == "send") {
                                if (summary.amount >= 25000000000000000000000000000000000) {
				from = " from Unknown Account - ";
                                to = " to Unknown Account - ";
                                //if recognised then add to message
                                if (contents['account'] in aliasHash) {
                                    from = ' from ' + aliasHash[contents['account']] + ' - ';
                                }

                                if (contents['link_as_account'] in aliasHash) {
                                    to = ' to ' + aliasHash[contents['link_as_account']] + ' - ';
                                }

                                //tweet based on size
                                if (+summary.amount >= 200000000000000000000000000000000000) {
                                    start = 'NANOODLE Watch Quadruple Whale Alert 🐳🐳🐳🐳 - ';
                                }
                                else if (+summary.amount >= 150000000000000000000000000000000000) {
                                    start = 'NANOODLE Watch Triple Whale Alert 🐳🐳🐳 - ';

                                }
                                else if (+summary.amount >= 100000000000000000000000000000000000) {
                                    start = 'NANOODLE Watch Double Whale Alert 🐳🐳 - ';

                                }
                                else if (+summary.amount >= 50000000000000000000000000000000000) {
                                    start = 'NANOODLE Watch Whale Alert 🐳 - ';

                                }
                                else {
                                    //should be in this range if not others
                                    start = 'NANOODLE Watch Dolphin Alert 🐬 - ';
                                }
                                try {
                                    console.log("Twitter Alert");
                                    twitterClient.post('statuses/update', { status: start + from + to + (+summary.amount / 1000000000000000000000000000000).toFixed() + ' $NANO transfer ($' + (+summary.amount * +usdRate / 1000000000000000000000000000000).toFixed() + ') -  https://nanoodle.io/block/' + keyValue });
                                }
                                catch (err) {
                                    console.log(err);
                                }
                                try {
                                    console.log("Discord Alert");
                                    discordMessage(start, from, to, keyValue, summary.amount, usdRate);
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                            //build message up for watched accounts
                            if (contents['account'] in primaryAccount) {
                                primaryAccount[contents['account']] = primaryAccount[contents['account']] + "\n<tr><td><right><a href=\"https://nanoodle.io/block/" + key[i] + "\">View Block<a></right></td><td><font color=\"red\">-" + formatAmount(+summary['amount']) + "</font></td>\n<tr>\n";
                            }
                            if (contents['link_as_account'] in primaryAccount) {
                                primaryAccount[contents['link_as_account']] = primaryAccount[contents['link_as_account']] + "\n<tr><td><right><a href=\"https://nanoodle.io/block/" + key[i] + "\">View Block<a></right></td><td><font color=\"green\">+" + formatAmount(+summary['amount']) + "</font></td>\n<tr>\n";
                            }
                        }
                        //go through each account and see if there is a message to publish
                        for (account in primaryAccount) {
                            if (primaryAccount[account].length > 0) {
                                try {
                                    mailOptions = {
                                        from: 'contact@nanoodle.io',
                                        to: primaryEmail[account],
                                        subject: `NANOODLE Watch: Nano Account Activity Detected`,
                                        html: 'NANOODLE Watch has detected transactions on your watched account over the last ' + minutes + ' minutes.\n\n<h2>Account</h2>\n<a href="https://nanoodle.io/account/' + account + '">' + account + '</a>\n\n<h2>Transactions</h2><table><tr><th>Block</th><th>Amount</th></tr>\n' + primaryAccount[account] + '</table>\n\n<h2>Donate</h2>\nIf you find NANOODLE\'s products valuable, please consider a Nano donation to <a href=\"https://nanoodle.io/account/nano_1e6e41up4x5e4jke6wy4k6nnuagagspfx4tjafghub6cw46ueimqt657nx4a\">nano_1e6e41up4x5e4jke6wy4k6nnuagagspfx4tjafghub6cw46ueimqt657nx4a</a>\n\n<h2>Unwatch Account</h2>\n<a href=\"https://nanoodle.io/unsubscribe/' + primaryKey[account]['key'] + '\">Unwatch</a> this account in order to stop receiving notifications'
                                    };
                                    // create mail transporter
                                    transporter = nodemailer.createTransport({
                                        service: "gmail",
                                        auth: {
                                            user: process.env.GOOGLE_USER,
                                            pass: process.env.GOOGLE_PASSWORD
                                        }
                                    });
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        console.log('Message sent: ' + info.response);
                                    });
                                    transporter.close();
                                }
                                catch (err) {
                                    console.log(err);
                                }
                            }
                        }
}
                    })
                        .catch(error => console.log(error));
                })
                    .catch(error => console.log(error));
            })
                .catch(error => console.log(error));
        })
            .catch(error => console.log(error));
    }
})
    .catch(error => console.log(error));

function discordMessage(start, from, to, keyValue, amount, usdRate) {
        let client = new Discord.Client();
        client.login(process.env.DISCORD_TOKEN).then(function () {
        let temp = start + from + to + (+amount / 1000000000000000000000000000000).toFixed() + ' $NANO transfer ($' + (+amount * +usdRate / 1000000000000000000000000000000).toFixed() + ') -  https://nanoodle.io/block/' + keyValue;
        //nanoodle discord
        alertChannel = client.channels.get("604744766722408458");
        alertChannel.send(temp);
        //nanotrade discord
        alertChannel = client.channels.get("604731087369011230");
        alertChannel.send(temp);
        //nano center trade-chat
        alertChannel = client.channels.get("539992189657415681");
        alertChannel.send(temp);
        client.destroy();
    });
}


function getAlias() {
    console.log("Get Alias Method");
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', ninjaUrl, true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            // This is called even on 404 etc
            // so check the status 
            if (this.readyState === 4 && this.status === 200) {
                // Resolve the promise with the response text
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(JSON.parse(xhr.statusText)));
            }
        };
        // Handle network errors
        xhr.onerror = function () {
            reject(Error("Network Error")); console.log(xhr.responseText);
        };
        // Make the request
        xhr.send();
    });
}

function getAccounts(accountUrl) {
    console.log("Get Accounts Method");
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", accountUrl, true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            // This is called even on 404 etc
            // so check the status 
            if (this.readyState === 4 && this.status === 200) {
                // Resolve the promise with the response text
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(JSON.parse(xhr.statusText)));
            }
        };
        // Handle network errors
        xhr.onerror = function () {
            console.log(xhr.responseText);
            reject(Error("Network Error")); console.log(xhr.responseText);
        };
        // Make the request
        xhr.send();
    });
}

function getNewBlocks() {
    console.log("Get New Blocks Method");
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        blockURL = 'http://localhost:8082/blocks/input?filter={"log.epochTimeStamp":{$gt: new Date(' + paramDate.getTime() + ')}}&keys={"hash":1}&keys={"amount" : 1 }&sort={"log.epochTimeStamp" : -1}&pagesize=1000&np'
        xhr.open("GET", blockURL, true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            // This is called even on 404 etc
            // so check the status 
            if (this.readyState === 4 && this.status === 200) {
                // Resolve the promise with the response text
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(JSON.parse(xhr.statusText)));
            }
        };
        // Handle network errors
        xhr.onerror = function () {
            reject(Error("Network Error")); console.log(xhr.responseText);
        };
        // Make the request
        xhr.send();
    });
}

function getMarketPrice(currencyType) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        marketURL = 'http://localhost:8082/core/price?filter={"log.epochTimeStamp":{$gte: new Date(' + priceDate.getTime() + ')}}&filter={' + currencyType + ': {"$exists": true }}&np'
        xhr.open("GET", marketURL, true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            // This is called even on 404 etc
            // so check the status
            if (this.readyState === 4 && this.status === 200) {
                // Resolve the promise with the response text
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(JSON.parse(xhr.statusText)));
            }
        };
        // Handle network errors
        xhr.onerror = function () {
            reject(Error("Network Error")); console.log(xhr.responseText);
        };
        // Make the request
        xhr.send();
    });
}


function getBlockData(hashParam) {
    console.log("Get BlockData Method");
    getBlockDataBody = JSON.stringify({
        "action": "blocks_info",
        "hashes": hashParam
    });
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', nodeUrl, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            // This is called even on 404 etc
            // so check the status 
            if (this.readyState === 4 && this.status === 200) {
                // Resolve the promise with the response text
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(JSON.parse(xhr.statusText)));
            }
        };
        // Handle network errors
        xhr.onerror = function () {
            reject(Error("Network Error")); console.log(xhr.responseText);
        };
        // Make the request
        xhr.send(getBlockDataBody);
    });
}

function markSent(sentKey) {
    console.log("Mark Sent Method");
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        patchString = 'http://localhost:8082/core/watch/*?filter={"key":"' + sentKey + '"}'
        xhr.open('PATCH', patchString, true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(process.env.BACKEND_USER + ":" + process.env.BACKEND_PASSWORD));
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function () {
            // This is called even on 404 etc
            // so check the status 
            if (this.readyState === 4 && this.status === 200) {
                // Resolve the promise with the response text
                resolve(JSON.parse(xhr.responseText));
            }
            else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(JSON.parse(xhr.statusText)));
            }
        };
        // Handle network errors
        xhr.onerror = function () {
            reject(Error("Network Error")); console.log(xhr.responseText);
        };
        // Make the request
        xhr.send(sentBody);
    });
}

//RPC block results have a bunch of extra characters that need removing before a parse
function formatContent(jsonRepParam) {
    return jsonRepParam.replace(/\\n/g, "").replace(/\\/g, "").replace(/\"{/g, "{").replace(/}\"/g, "}");
}

function formatAmount(mRai) {
    temp = mRai / raw;
    return temp.toFixed(dec);
}

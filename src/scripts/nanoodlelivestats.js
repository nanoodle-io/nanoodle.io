require('/root/scripts/node_modules/dotenv').config({ path: '/root/scripts/.env' })

var XMLHttpRequest = require("/root/scripts/node_modules/xmlhttprequest").XMLHttpRequest;
var Twitter = require('/root/scripts/node_modules/twitter');
var twitterConfig = require('/root/scripts/twitterConfig.js');
var twitterClient = new Twitter(twitterConfig);

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

const nodeUrl = 'http://localhost:7076'
const dec = 6;
const raw = 1000000000000000000000000000000;

getConfirmationQuorum().then(data => {
var  minweight = +(+data['online_stake_total']/1000).toFixed();
getRepresentatives().then(data => {
var str = JSON.stringify(data['representatives']);
var representatives = str.split(",");i
var prs = "[";
var prCount = 0;
var total = 0;
var totalPercentageDelegated = 0;
for (var i=0; i<representatives.length; i++)
{
var regex = /"(\d+)"/g;
var regex2 = /(nano_.+)":".*"/g;
var weight = +regex.exec(representatives[i])[1];
var rep = regex2.exec(representatives[i])[1];
if (weight > minweight)
{
if (prCount>0)
{
prs= prs + ",";
}
prCount++;
prs=prs + "{\"representative\":\"" + rep + "\",\"weight\":" + weight + "}";
total=total+weight;
}
}
prs = prs + "]";
var sortable = JSON.parse(prs);
sortable.sort(function(a, b) {
    return Number(a.weight) - Number(b.weight);
});

for (var i=0; i<sortable.length; i++)
{
sortable[i]["percentageDelegated"] = sortable[i]["weight"]/total;
totalPercentageDelegated = totalPercentageDelegated + sortable[i]["percentageDelegated"];
sortable[i]["totalPercentageDelegated"] = totalPercentageDelegated;
}
var totalAreaUnderLorenz=0;
for (var i=0; i<sortable.length; i++)
{
if (i==0)
{
sortable[i]["areaUnderLorenz"]=sortable[i]["totalPercentageDelegated"]/2*(1/prCount);
}
else
{
sortable[i]["areaUnderLorenz"]=(sortable[i]["totalPercentageDelegated"]+sortable[i-1]["totalPercentageDelegated"])/2*(1/prCount);
}
totalAreaUnderLorenz = totalAreaUnderLorenz + sortable[i]["areaUnderLorenz"];
console.log(sortable[i]);
}
var areaOfA = 0.5 - totalAreaUnderLorenz;
var gini = areaOfA / (areaOfA + totalAreaUnderLorenz);

console.log("PR Count: " + prCount);
console.log("Gini: " + gini);

try {
                                    console.log("Twitter Alert");
                                    twitterClient.post('statuses/update', { status: "The $NANO Gini Coefficient currently sits at " + gini.toFixed(4) + " based on the current population of " + prCount + " Principal Representatives (PRs). This is a measure of voting equality, with 0 meaning all PRs have exactly the same voting power delegated to them." });
                                }
                                catch (err) {
                                    console.log(err);
                                }

});
})
    //catch errors from account retrieval
    .catch(error => console.log(error));

function getConfirmationQuorum() {
    body = JSON.stringify({
        "action": "confirmation_quorum"
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
        xhr.send(body);
    });
}

function getRepresentatives() {
    body = JSON.stringify({
        "action": "representatives"
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
        xhr.send(body);
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

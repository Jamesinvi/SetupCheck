//imports
const express = require("express");
const fetch = require("node-fetch");
const compression = require('compression');
const passport = require("passport");
//const cluster = require('cluster');
var BnetStrategy = require('passport-bnet').Strategy;
require("dotenv").config();

var BNET_ID = process.env.BNET_ID
var BNET_SECRET = process.env.BNET_SECRET

// Use the BnetStrategy within Passport.
passport.use(new BnetStrategy({
    clientID: BNET_ID,
    clientSecret: BNET_SECRET,
    callbackURL: "https://localhost:3000/auth/bnet/callback",
    region: "eu"
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));


// // Listen for dying workers
// cluster.on('exit', function (worker) {

//     // Replace the dead worker,
//     // we're not sentimental
//     console.log('Worker %d died :(', worker.id);
//     cluster.fork();

// });

// if(cluster.isMaster){
//     // Count the machine's CPUs
//     var cpuCount = require('os').cpus().length;

//     // Create a worker for each CPU
//     for (var i = 0; i < cpuCount; i += 1) {
//         cluster.fork();
//     }
// }else{
//init server
const app = express();
app.use(compression());
//get raids at startup from warcraftLogs
let data;
let raids = [];
let talentDataToSend = [];
let covenantDataToSend = [];
let key = process.env.API_KEY;
let port = process.env.PORT || 3000;

const credentials = {
    client: {
        id: BNET_ID,
        secret: BNET_SECRET
    },
    auth: {
        tokenHost: "https://us.battle.net"
    }
};
const oauth2 = require("simple-oauth2").create(credentials);
let token = null;
async function getToken() {
    if (token === null) {
        return oauth2.clientCredentials
        .getToken()
        .then(oauth2.accessToken.create)
        .then(t => {
            token = t.token.access_token;
            console.log("got token: ", token);
        });
    }
}
getToken().then(getTalentsData).then(getCovenantsData);
getRaidData();
//getTalentsData();

//fetch raids from warcraftLogs
async function getRaidData() {
    let response = await fetch(`https://www.warcraftlogs.com:443/v1/zones?api_key=${key}`);
    data = await response.json();
    getRaids(data);
}
//fetch talents from wowAPI
async function getTalentsData() {
    let response = await fetch(`https://eu.api.blizzard.com/data/wow/playable-specialization/index?namespace=static-eu&locale=en_GB&access_token=${token}`);
    let json = await response.json();
    talentDataToSend.length = 0;
    for (let spec of json.character_specializations) {
        let specData = await fetch(`https://eu.api.blizzard.com/data/wow/playable-specialization/${spec.id}?namespace=static-eu&locale=en_GB&access_token=${token}`);
        let jsonSpecData = await specData.json();
        talentDataToSend.push({
            "class_name": jsonSpecData.playable_class.name,
            "spec_name": jsonSpecData.name,
            "class_id": jsonSpecData.playable_class.id,
            "talents": jsonSpecData.talent_tiers
        });
    }
    console.log("got talent data");
}
//fetch covenants from wowAPI
async function getCovenantsData(){
    let response = await fetch(`https://eu.api.blizzard.com/data/wow/covenant/index?namespace=static-eu&locale=en_GB&access_token=${token}`);
    let json = await response.json();
    covenantDataToSend.length = 0;
    for (let covenant of json.covenants) {
        covenantDataToSend.push({
            "name": covenant.name,
            "id": covenant.id,
        });
    }
    console.log("got covenant data");
}
//put all the raids in a variable
function getRaids(data) {
    raids.length = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].name.toLowerCase() == "battle of dazar'alor" || data[i].name.toLowerCase() == "crucible of storms" || data[i].name.toLowerCase() == "the eternal palace" || data[i].name.toLowerCase() == "ny'alotha" || data[i].name.toLowerCase() == "castle nathria") {
            raids.push(data[i]);
        }
    }
}
//return correct raid based on the name
function selectCorrectRaid(value) {
    for (let i = 0; i < raids.length; i++) {
        if (raids[i].name.toLowerCase() == value) {
            return raids[i];
        }
    }
}


//startup the socket at port from enviroment
app.listen(port, () => console.log(`listening at port ${port}`));
app.use(express.static("public"));
app.use(express.json({ limit: "6mb" }));


//post and get endpoints
app.post("/raid", (request, response) => {
    let value = request.body.val;
    const selectedRaid = selectCorrectRaid(value);
    response.json({
        raid: selectedRaid
    });
})
app.get("/talents", (request, response) => {
    response.end(JSON.stringify(talentDataToSend));
});
app.get("/covenants", (request, response) => {
    response.end(JSON.stringify(covenantDataToSend));
});
app.post("/encounter", async (request, response) => {
    let dataToSendBack = [];
    let value = request.body;
    const boss = value.boss;
    const gameclass = value.class;
    const spec = value.spec;
    const metric = value.metric;
    const difficulty = value.difficulty;
    const pages = value.pages;
    let promises = [];
    
    for (let i = 0; i < pages; i++) {
        let promise = rankingData(boss, metric, difficulty, gameclass, spec, i, key);
        promises.push(promise);
    }
    Promise.all(promises).then((results) => {
        for (let i = 0; i < results.length; i++) {
            dataToSendBack.push(results[i]);
        }
        response.end(JSON.stringify(dataToSendBack));
    }).catch((err) => console.log(err));
    
    
})
async function rankingData(boss, metric, difficulty, gameclass, spec, page, key) {
    let api_url = `https://www.warcraftlogs.com:443/v1/rankings/encounter/${boss}?metric=${metric}&difficulty=${difficulty}&class=${gameclass}&spec=${spec}&page=${page}&includeCombatantInfo=true&api_key=${key}`;
    let fetchResponse = await fetch(api_url);
    let json = await fetchResponse.json();
    return json;
}

// }

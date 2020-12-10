// #region variables
let errorObj={status: 400, error: "The maximum page value supported by the API is 50."};
let raid;
let rankingsData;
let talentData;
let trinketData;
let legendaryData;
let covenantData;

let trinketWithTalentsData;

let talentsSelectedIDs = "";
let talentNames = [];
let trinketNames = [];
let legendaryNames = [];
let covenantNames = [];

let talentScore = [];
let ilvlScore = [];
let ilvlWithTalents = [];
let trinketScoreWithTalents = [];
let trinketScore = [];
let talentCombinations;

let barColors = [];
let internalBarColors = [];
let talentLabels = [];
let trinketsWithTalentsLabels = [];
let covenantLabels = [];

let debug = false;
let difficultyFlag = false;
let classFlag = false;
let metricFlag = false;
let specFlag = false;
let bossFlag = false;
let talentsFromBlizzard;
let covenantsFromBlizzard;
let gameClass;
let boss;
let spec;
let selectedDifficulty;
let selectedMetric;
let specName;
// #endregion
// #region buttons & HTML elements
//get all buttons by ID
const button_3 = document.getElementById("request");

button_3.setAttribute("disabled", true);

//DOM elements here
const slider = document.getElementById("number-of-pages");
const output = document.getElementById("number-of-pages-header");
const talentsDiv = document.getElementById("talentsDiv");
const trinketsDiv = document.getElementById("trinketsDiv");
const legendariesDiv = document.getElementById("legendariesDiv");
const covenantDiv = document.getElementById("covenantDiv");
let classes = document.getElementById("classes");
let specs = document.getElementById("specs");
let specsHeader = document.getElementById("specs-header");

let bosses = document.getElementById("bosses");
let difficulty = document.getElementById("difficulty");
let metric = document.getElementById("metric");

talentsDiv.style.display = "none";
trinketsDiv.style.display = "none";
legendariesDiv.style.display = "none";
covenantDiv.style.display = "none";
// bosses.style.display = "none";


output.innerHTML = `Number of pages: ${slider.value}`; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = `Number of pages: ${this.value}`
}


// #endregion
// #region  events
function showSpecs(object){
    let spec = object.value;
    createSpecSelection(spec);
}

//special listener to request encounter data
button_3.addEventListener("click", async function () {
    button_3.disabled = true;
    let data = compileRequestData();
    requestRankings(data);

})
//#endregion

function checkFormComplete() {
    if (boss != null && spec != null && gameClass != null && specName!=null && selectedMetric != null && selectedDifficulty != null)
        button_3.disabled = false;
    else
        button_3.disabled = true;
}


// #region request server for data

//request talents and covenants as soon as possible
requestTalents();
requestCovenants();
async function requestTalents() {
    const response = await fetch("/talents");
    const json = await response.json();
    talentsFromBlizzard = json;

}
async function requestCovenants() {
    const response = await fetch("/covenants");
    const json = await response.json();
    covenantsFromBlizzard = json;

}
//called by the button to request data. does a post/fetch call to the server
async function requestRankings(data) {
    console.log(data);
    //timer to prevent spammin the server
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/encounter", options);
    const json = await response.json().then(button_3.disabled = false);
    // // console.log("rankings from server:");
    // // console.log(json);
    if(JSON.stringify(json[0])==JSON.stringify(errorObj)){
        json.shift();
    }
    rankingsData = json;
    talentNames = [];
    showData();

}
async function requestFights(data) {
    let toSend = { val: data.value };
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(toSend)
    };
    const response = await fetch("/raid", options);
    const json = await response.json();
    //console.log(data);
    raid = json;
    refreshBossHTML();
}
//creates a json request file from the selected radios to send to the server
function compileRequestData() {
    let data = {};
    boss = bosses.value;
    gameClass = classes.value;
    specName = specs.value;
    selectedDifficulty = difficulty.value;
    selectedMetric = metric.value;
    
    data.boss = bosses.value;
    data.class = classes.value;
    data.spec = specs.value;
    data.difficulty = difficulty.value;
    data.metric = metric.value;
    data.pages = document.getElementById("number-of-pages").value;
    // console.log(data);
    return data;
}
// #endregion

// #region create HTML elements
function refreshBossHTML() {
    while (bosses.hasChildNodes()) {
        bosses.removeChild(bosses.firstChild);
    }
    for (let i = 0; i < raid.raid.encounters.length; i++) {
        let encounter = raid.raid.encounters[i];
        let option = document.createElement("option");
        option.appendChild(document.createTextNode(encounter.name));
        option.value = encounter.id;
        bosses.appendChild(option);
    }
}


function createSpecSelection(gameClass) {
    specs.style.display = "inline";
    specsHeader.style.display = "block";
    while (specs.hasChildNodes()) {
        specs.removeChild(specs.firstChild);
    }
    if (gameClass == "1") {
        createSpecOption(1, "Blood");
        createSpecOption(2, "Frost");
        createSpecOption(3, "Unholy");
    }
    if (gameClass == "2") {
        createSpecOption(1, "Balance");
        createSpecOption(2, "Feral");
        createSpecOption(3, "Guardian");
        createSpecOption(4, "Restoration");
    }
    if (gameClass == "3") {
        createSpecOption(1, "Beast Mastery");
        createSpecOption(2, "Marksmanship");
        createSpecOption(3, "Survival");
    }
    if (gameClass == "4") {
        createSpecOption(1, "Arcane");
        createSpecOption(2, "Fire");
        createSpecOption(3, "Frost");
    }
    if (gameClass == "5") {
        createSpecOption(1, "Brewmaster");
        createSpecOption(2, "Mistweaver");
        createSpecOption(3, "Windwalker");
    }
    if (gameClass == "6") {
        createSpecOption(1, "Holy");
        createSpecOption(2, "Protection");
        createSpecOption(3, "Retribution");
    }
    if (gameClass == "7") {
        createSpecOption(1, "Discipline");
        createSpecOption(2, "Holy");
        createSpecOption(3, "Shadow");
    }
    if (gameClass == "8") {
        createSpecOption(1, "Assassination");
        //createSpecOption(2, "Combat", specRadios, 42);
        createSpecOption(3, "Shadow");
        createSpecOption(3, "Outlaw");
    }
    if (gameClass == "9") {
        createSpecOption(1, "Elemental");
        createSpecOption(2, "Enhancement");
        createSpecOption(3, "Restoration");
    }
    if (gameClass == "10") {
        createSpecOption(1, "Affliction");
        createSpecOption(2, "Demonology");
        createSpecOption(3, "Destruction");
    }
    if (gameClass == "11") {
        createSpecOption(1, "Arms");
        createSpecOption(2, "Fury");
        createSpecOption(3, "Protection");
    }
    if (gameClass == "12") {
        createSpecOption(1, "Havoc");
        createSpecOption(2, "Vengeance");
    }
}

function createSpecOption(spec, specName) {
    let option = document.createElement("option");
    option.appendChild(document.createTextNode(specName));
    option.value = spec;
    specs.appendChild(option);
    

}

function createWowheadDiv(elements, parentID, type) {
    //get the wowhead div
    let checkType = type;
    let div = document.getElementById(`${checkType}`);
    //if not found create one
    if (div == null) {
        div = document.createElement("div");
        div.id = `${checkType}`;
    } else {
        //clear all entries to avoid talent from multiple classes to accumulate
        var child = div.lastElementChild;
        while (child) {
            div.removeChild(child);
            child = div.lastElementChild;
        }
    }
    let occurences = [];
    Object.values(elements).forEach((elt) => { occurences.push(elt[0]) });
    occurences = occurences.sort((a, b) => b - a).slice(0, 5);
    let counterVal = 1;
    for (let occurenceCheck of occurences) {
        for (let n = 0; n < Object.keys(elements).length; n++) {
            let occurence = Object.values(elements)[n][0];
            if (occurenceCheck == occurence) {
                let IDs = Object.keys(elements)[n].split(",");
                let talentSet = document.createElement("div");
                if (type != "item") {
                    talentSet.setAttribute("class", "btn-group-vertical mr-3 talentSet");
                    talentSet.setAttribute("id", counterVal);
                    counterVal++;
                } else {
                    talentSet.setAttribute("class", "btn-group-vertical mr-2 talentSet");
                }
                if (occurences.includes(occurence)) {
                    for (let value of IDs) {
                        let wowheadLink = document.createElement("a");
                        wowheadLink.href = `https://www.wowhead.com/${checkType}=${value}`;
                        if (type == "legendary-spell")
                            wowheadLink.href = `https://www.wowhead.com/spell=${value}`;
                        wowheadLink.type = "button";
                        wowheadLink.className = "btn btn-dark";
                        if (checkType == "spell")
                            wowheadLink.innerHTML = getTalentNameByID(value);
                        else if( checkType == "item")
                            wowheadLink.innerHTML = getTrinketNameByID(value);
                        else if (checkType == "legendary-spell")
                            wowheadLink.innerHTML = getLegendaryNameByID(value);
                        let wowString = `${checkType}=${value}`;
                        wowheadLink.setAttribute = wowString;
                        talentSet.appendChild(wowheadLink);
                    }
                    if (div.childElementCount > 4) {
                        //console.log("called");
                        break;
                    }
                    div.appendChild(talentSet);

                }
            }
        }
    }

    let parent = document.getElementById(parentID);
    parent.appendChild(div);
}

// #endregion

// #region process & show the data we got

//responsible to collect all the data from the processData.js functions and adding them to the charts
function showData() {
    talentsDiv.style.display = "block";
    trinketsDiv.style.display = "block";
    legendariesDiv.style.display = "block";
    covenantDiv.style.display = "block";

    talentData = getTalentCombos();
    ilvlScore=[];
    talentScore=[];
    talentCombinations = [];
    talentLabels = getTalentLabels(talentData);

    (Object.values(talentData)).forEach((elt) => { talentCombinations.push(elt[0]) });
    (Object.values(talentData)).forEach((elt) => { talentScore.push(elt[1]) });
    (Object.values(talentData)).forEach((elt) => { ilvlScore.push(elt[2]) });

    let ilvlDataSet= {
        name: "Item Level",
        data: ilvlScore,
        type: "line"
    };
    let talentScoreDataSet = {
        name: "Talent Score",
        data: talentScore,
        type: "line"
    };
    let talentBarDataSet = {
        name: "Frequency",
        data: talentCombinations,
        type: "bar"
    };
    let options = {
        chart: {
            type: 'line',
            stacked: false,
            toolbar: {
                show: true,
                tools: {
                  zoomout: false,
                  pan: false,
                },
                autoSelected: 'zoom' 
            },
            background: '#2B3E50' ,
            fontFamily: 'Questrial, sans-serif',
        },
        theme: {
            mode: "dark",
            palette: "palette1"
        },

        series: [ilvlDataSet, talentScoreDataSet, talentBarDataSet],
        legend: {
            fontSize: "25vm"
        },
        xaxis: {
            type: "categories",
            labels: {
                show: false,
                formatter: function(value) {
                    value= Math.floor( value );
                    value=clamp(value,1,Object.keys(talentData).length);
                    let stringAcc="<ul>";
                    let talentCombo = Object.keys(talentData)[value-1].split(",");
                    for(let i=0;i<talentCombo.length;i++){
                        if(i==0)
                        stringAcc += "<li>" +getTalentNameByID(talentCombo[i])+ "</li>";
                        else
                        stringAcc += "<li>"+ getTalentNameByID(talentCombo[i]) + "</li>";
                    }
                    stringAcc+="</ul>";
                    return stringAcc;
                }
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: [
            {
              title: {
                text: "Item Level",
                style:{
                    fontSize: "35vm"
                }
              },
            },
            {
              opposite: true,
              title: {
                text: "DPS / HPS",
                style:{
                    fontSize: "35vm"
                }
              }
            } 
        ]
    }
    talentChart.updateOptions(options);
    createWowheadDiv(talentData, "wowhead-spell", "spell");

    trinketData = getTrinketCombos();
    trinketCombinations = [];
    trinketScore = [];
    ilvlScore = [];
    (Object.values(trinketData)).forEach((elt) => { trinketCombinations.push(elt[0]) });
    (Object.values(trinketData)).forEach((elt) => { trinketScore.push(elt[1]) });
    (Object.values(trinketData)).forEach((elt) => { ilvlScore.push(elt[2]) });
    trinketLabels = getTrinketLabels(trinketData);

    ilvlDataSet= {
        name: "Item Level",
        data: ilvlScore,
        type: "line"
    };
    talentScoreDataSet = {
        name: "Trinket Score",
        data: trinketScore,
        type: "line"
    };
    talentBarDataSet = {
        name: "Frequency",
        data: trinketCombinations,
        type: "bar"
    };
    trinketChart.updateOptions(options);
    let newOptions= {
        xaxis: {
            type: "categories",
            labels: {
                show: false,
                formatter: function(value) {
                    value= Math.floor( value );
                    value=clamp(value,1,Object.keys(trinketData).length);
                    let stringAcc="<ul>";
                    let trinketCombo = Object.keys(trinketData)[value-1].split(",");
                    for(let i=0;i<trinketCombo.length;i++){
                        if(i==0)
                        stringAcc += "<li>" +getTrinketNameByID(trinketCombo[i])+ "</li>";
                        else
                        stringAcc += "<li>"+ getTrinketNameByID(trinketCombo[i]) + "</li>";
                    }
                    stringAcc+="</ul>";
                    return stringAcc;
                }
            },
            tooltip: {
                enabled: false
            }
        },
    }
    trinketChart.updateOptions(newOptions);
    trinketChart.updateSeries([ilvlDataSet, talentScoreDataSet, talentBarDataSet]);
    createWowheadDiv(trinketData, "wowhead-item", "item");

    legendaryData = getLegendariesCombos();
    ilvlScore=[];
    legendaryScore = [];
    legendaryCombinations = [];
    legendaryLabels = getLegendaryLabels(legendaryData);


    (Object.values(legendaryData)).forEach((elt) => { legendaryCombinations.push(elt[0]) });
    (Object.values(legendaryData)).forEach((elt) => { legendaryScore.push(elt[1]) });
    (Object.values(legendaryData)).forEach((elt) => { ilvlScore.push(elt[2]) });
    ilvlDataSet= {
        name: "Item Level",
        data: ilvlScore,
        type: "line"
    };
    let legendaryScoreDataSet = {
        name: "Legendary Score",
        data: legendaryScore,
        type: "line"
    };
    let legendaryBarDataSet = {
        name: "Frequency",
        data: legendaryCombinations,
        type: "bar"
    };
    let legendaryOptions = {
        chart: {
            type: 'line',
            stacked: false,
            toolbar: {
                show: true,
                tools: {
                  zoomout: false,
                  pan: false,
                },
                autoSelected: 'zoom' 
            },
            background: '#2B3E50' ,
            fontFamily: 'Questrial, sans-serif',
        },
        theme: {
            mode: "dark",
            palette: "palette1"
        },

        series: [ilvlDataSet, legendaryScoreDataSet, legendaryBarDataSet],
        legend: {
            fontSize: "25vm"
        },
        xaxis: {
            type: "categories",
            labels: {
                show: false,
                formatter: function(value) {
                    value= Math.floor( value );
                    value=clamp(value,1,Object.keys(legendaryData).length);
                    return talentCombo = getLegendaryNameByID(Object.keys(legendaryData)[value - 1]);
                }
            },
            tooltip: {
                enabled: false
            }
        },
        yaxis: [
            {
              title: {
                text: "Item Level",
                style:{
                    fontSize: "35vm"
                }
              },
            },
            {
              opposite: true,
              title: {
                text: "DPS / HPS",
                style:{
                    fontSize: "35vm"
                }
              }
            } 
        ]
    }
    legendaryChart.updateOptions(legendaryOptions);
    createWowheadDiv(legendaryData, "wowhead-legendary-spell", "legendary-spell");

    covenantData = getCovenantCombos();
    covenantLabels = [];
    covenantCombinations = [];
    (Object.values(covenantData)).forEach((elt) => { covenantLabels.push(elt[0]) });
    (Object.values(covenantData)).forEach((elt) => { covenantCombinations.push(elt[1]) });


    let covenantOptions={
        chart:{
            fontFamily: 'Questrial, sans-serif',
            width: '70%',
        },
        theme: {
            mode: "dark",
            palette: "palette1"
        },
        legend: {
            fontSize: "18vm",
            position: 'bottom',
            height: 250
        },
        labels: covenantLabels,
        dataLabels: {
            enabled: true,
        },

    }
    covenantChart.updateSeries(covenantCombinations);
    covenantChart.updateOptions(covenantOptions)



}
//#endregion

// #region variables
let raid;
let rankingsData;
let talentData;
let trinketData;
let essenceData;
let trinketWithTalentsData;
let essencesWithTalentsData;
let talentsSelectedIDs = "";
let talentNames = [];
let trinketNames = [];
let azeriteNames = [];
let essenceNames=[];
let talentScore = [];
let ilvlScore = [];
let ilvlWithTalents = [];
let trinketScoreWithTalents = [];
let trinketScore = [];
let talentCombinations;
let majorEssenceCombinations;
let minorEssenceCombinations;
let trinketCombinations;
let trinketCombosWithTalents;
let azeriteOccurences;
let azeriteOccurencesWithTalents;
let azeriteRingOneCombinations;
let azeriteRingTwoCombinations;
let azeriteRingThreeCombinations;
let barColors = [];
let internalBarColors = [];
let talentLabels = [];
let trinketsWithTalentsLabels = [];
let majorEssenceLabels=[];
let minorEssenceLabels=[];
let debug = false;
let difficultyFlag = false;
let classFlag = false;
let metricFlag = false;
let specFlag = false;
let bossFlag = false;
let talentsFromBlizzard;
let gameClass;
let boss;
let spec;
let selectedDifficulty;
let selectedMetric;
let specName;
// #endregion
// #region buttons & HTML elements
//get all buttons by ID
const button_1 = document.getElementById("submit-cos");
const button_2 = document.getElementById("submit-bod");
const button_5 = document.getElementById("submit-ep");
const button_3 = document.getElementById("request");

const button_4 = document.getElementById("trinkets-with-talents");
button_3.setAttribute("disabled", true);

//DOM elements here
let specRadios;
const slider = document.getElementById("number-of-pages");
const output = document.getElementById("number-of-pages-header");
const talentsDiv = document.getElementById("talentsDiv");
const trinketsDiv = document.getElementById("trinketsDiv");
const azeriteDiv = document.getElementById("azeriteDiv");
let classes = document.getElementById("classes");
const talentsSelected = document.getElementById("talentSelectFormGroup");
const talentSelectionDiv = document.getElementById("talentSelectionDiv");
const trinketsWithTalentsDiv = document.getElementById("trinketsWithTalentsDiv");
const azeriteWithTalentsDiv = document.getElementById("azeriteWithTalentsDiv");
const essencesWithTalentsDiv = document.getElementById("essencesWithTalentsDiv");
const essenceDiv = document.getElementById("essenceDiv");
const talentPresetSelection = document.getElementById("presetSelection");
const talentGraphResetZoom = document.getElementById("talentGraphReset");
const trinketGraphResetZoom = document.getElementById("trinketGraphReset");
const trinketWTalentsGraphResetZoom = document.getElementById("TrinketWTalentsGraphReset");
talentGraphResetZoom.addEventListener("click", resetZoom);
trinketGraphResetZoom.addEventListener("click", resetZoom);
trinketWTalentsGraphResetZoom.addEventListener("click", resetZoom);

talentsDiv.style.display = "none";
trinketsDiv.style.display = "none";
azeriteDiv.style.display = "none";
talentSelectionDiv.style.display = "none";
trinketsWithTalentsDiv.style.display = "none";
azeriteWithTalentsDiv.style.display = "none";
essenceDiv.style.display="none";
essencesWithTalentsDiv.style.display="none";

output.innerHTML = `Number of pages: ${slider.value}`; // Display the default slider value
button_3.disabled = true;


// #endregion

// #region event listeners

for (let talentPreset of Array.from(talentPresetSelection.children)) {
    talentPreset.addEventListener("click", selectTalentPreset);
}
for (let difficultyChild of Array.from(difficulty.children)) {
    difficultyChild.children[0].addEventListener("click", completeDataTest);
}
for (let metricChild of Array.from(metric.children)) {
    metricChild.children[0].addEventListener("click", completeDataTest);
}
for (let individualClass of Array.from(classes.children)) {
    individualClass.children[0].addEventListener("click", completeDataTest);
}
//get the selected talents string and then create data to display
button_4.addEventListener("click", function () {
    talentsSelectedIDs = "";
    for (let i = 0; i < talentsSelected.children.length; i++) {
        for (let j = 0; j < talentsSelected.children[i].children.length; j++) {
            let talentRow = talentsSelected.children[i].children[j];
            for (let n = 0; n < talentRow.children.length; n++) {
                if (talentRow.children[n].children[0].checked) {
                    let idValue = talentRow.children[n].children[0].value;
                    talentsSelectedIDs += idValue + (",");
                }
            }
        }

    }
    talentsSelectedIDs = talentsSelectedIDs.slice(0, -1);
    trinketWithTalentsData = getTrinketCombosWithTalents(talentsSelectedIDs);
    essencesWithTalentsData = getEssencesWithTalents(talentsSelectedIDs);

    createDataWithTalentsChart();
});
//presets are available: this makes sure when you click on a preset, the talent div is populated with correct values
function selectTalentPreset() {
    let talents = document.getElementById("spell");
    let selectedTalents;
    for (let talentCombo of Array.from(talents.children)) {
        if (talentCombo.id == this.children[0].value) {
            selectedTalents = talentCombo;
        }
    }

    let formParent = Array.from(document.getElementById("talentSelectFormGroup").children).filter(elt => { return elt.nodeName == "DIV" && elt.className == "btn-group" });
    for (let k = 0; k < formParent.length; k++) {
        let rowParent = formParent[k];
        for (let row of Array.from(rowParent.children)) {
            for (let talent of Array.from(row.children)) {
                let talentValue = talent.children[0].value;
                talent.children[0].checked = false;
                talent.className = "btn btn-danger  mr-1";
                for (let presetTalent of Array.from(selectedTalents.children)) {
                    let presetTalentValue = presetTalent.href.replace(/\D/g, "");
                    if (talentValue == presetTalentValue) {
                        talent.children[0].checked = true;
                        talent.className = "btn btn-danger  mr-1 active";
                    }
                }
            }
        }
    }
}
//this makes sure the user has selected all the fields before requesting data
function completeDataTest() {
    if (this.name == "difficulty") {
        //console.log("difficulty added: ", this.value);
        difficultyFlag = true;
    } else if (this.name == "class") {
        //console.log("class added: ", this.value);
        classFlag = true;
    } else if (this.name == "metric") {
        //console.log("metric added: ", this.value);
        metricFlag = true;
    } else if (this.name == "spec") {
        //console.log("spec added: ", this.value);
        specFlag = true;
    } else if (this.name == "encounter") {
        //console.log("boss added: ", this.id);
        bossFlag = true;
    }
    if (difficultyFlag && classFlag && metricFlag && specFlag && bossFlag) {
        button_3.disabled = false;
    }

}
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
    output.innerHTML = `Number of pages: ${this.value}`
}

//get the classes form and add an event listener to all of the radio elements
classes = document.getElementById("classes");
for (let loopGameClass of classes.childNodes) {
    if (loopGameClass.nodeName == "DIV") {
        loopGameClass.addEventListener("click", function (evt) {
            updateRadioElements(loopGameClass.childNodes[1].value);
        });
    }
}

//add event listeners to all buttons
button_1.addEventListener("click", function (evt) {
    // console.log("test");
    submitForm(this.value);
});

button_2.addEventListener("click", function (evt) {
    // console.log("test");

    submitForm(this.value);
});

button_5.addEventListener("click", function (evt) {
    // console.log("test");

    submitForm(this.value);
});


//special listener to request encounter data
button_3.addEventListener("click", async function () {
    button_3.disabled = true;
    let data = compileRequestData();
    requestRankings(data);

})

//based on what class is selected create radios and labels for specs
function updateRadioElements(evt) {
    const gameclass = evt;
    specRadios = document.getElementById("specs");
    let specHeader = document.getElementById("spec-header2");
    specHeader.style.visibility = "visible";
    while (specRadios.hasChildNodes()) {
        specRadios.removeChild(specRadios.firstChild);
    }
    // console.log(evt);
    if (gameclass == "1") {
        createSpecElement(1, "Blood", specRadios, 19);
        createSpecElement(2, "Frost", specRadios, 20);
        createSpecElement(3, "Unholy", specRadios, 21);
    }
    if (gameclass == "2") {
        createSpecElement(1, "Balance", specRadios, 22);
        createSpecElement(2, "Feral", specRadios, 23);
        createSpecElement(3, "Guardian", specRadios, 24);
        createSpecElement(4, "Restoration", specRadios, 25);
    }
    if (gameclass == "3") {
        createSpecElement(1, "Beast Mastery", specRadios, 26);
        createSpecElement(2, "Marksmanship", specRadios, 27);
        createSpecElement(3, "Survival", specRadios, 28);
    }
    if (gameclass == "4") {
        createSpecElement(1, "Arcane", specRadios, 29);
        createSpecElement(2, "Fire", specRadios, 30);
        createSpecElement(3, "Frost", specRadios, 31);
    }
    if (gameclass == "5") {
        createSpecElement(1, "Brewmaster", specRadios, 32);
        createSpecElement(2, "Mistweaver", specRadios, 33);
        createSpecElement(3, "Windwalker", specRadios, 34);
    }
    if (gameclass == "6") {
        createSpecElement(1, "Holy", specRadios, 35);
        createSpecElement(2, "Protection", specRadios, 36);
        createSpecElement(3, "Retribution", specRadios, 37);
    }
    if (gameclass == "7") {
        createSpecElement(1, "Discipline", specRadios, 38);
        createSpecElement(2, "Holy", specRadios, 39);
        createSpecElement(3, "Shadow", specRadios, 40);
    }
    if (gameclass == "8") {
        createSpecElement(1, "Assassination", specRadios, 41);
        //createSpecElement(2, "Combat", specRadios, 42);
        createSpecElement(3, "Shadow", specRadios, 43);
        createSpecElement(3, "Outlaw", specRadios, 44);
    }
    if (gameclass == "9") {
        createSpecElement(1, "Elemental", specRadios, 45);
        createSpecElement(2, "Enhancement", specRadios, 46);
        createSpecElement(3, "Restoration", specRadios, 47);
    }
    if (gameclass == "10") {
        createSpecElement(1, "Affliction", specRadios, 48);
        createSpecElement(2, "Demonology", specRadios, 49);
        createSpecElement(3, "Destruction", specRadios, 50);
    }
    if (gameclass == "11") {
        createSpecElement(1, "Arms", specRadios, 51);
        createSpecElement(2, "Fury", specRadios, 52);
        createSpecElement(3, "Protection", specRadios, 53);
    }
    if (gameclass == "12") {
        createSpecElement(1, "Havoc", specRadios, 54);
        createSpecElement(2, "Vengeance", specRadios, 55);
    }
}

function submitForm(evt) {
    const value = evt;
    let toSend = {
        val: value
    }
    requestFights(toSend);
}
// #endregion
// #region request server for data

//request talents as soon as possible
requestTalents();
async function requestTalents() {
    const response = await fetch("/talents");
    const json = await response.json();
    talentsFromBlizzard = json;

}
//called by the button to request data. does a post/fetch call to the server
async function requestRankings(data) {
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
    rankingsData = json;
    talentNames = [];
    //console.log(rankingsData);
    showData();

}
async function requestFights(data) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/raid", options);
    const json = await response.json();
    // // console.log(json);
    raid = json;
    refreshBossHTML();
}
//creates a json request file from the selected radios to send to the server
function compileRequestData() {
    let data = {};
    const bosses = document.getElementById("bosses");
    const specs = document.getElementById("specs");
    const difficulty = document.getElementById("difficulty");
    const metric = document.getElementById("metric");
    for (let i = 1; i < bosses.children.length; i++) {
        if (bosses.children[i].children[0].checked) {
            data.boss = bosses.children[i].id;
            boss = bosses.children[i].id;
        }
    }
    for (let j = 0; j < classes.children.length; j++) {
        if (classes.children[j].children[0].checked) {
            data.class = classes.children[j].children[0].value;
            gameClass = classes.children[j].children[0].value

        }
    }
    for (let k = 0; k < specs.children.length; k++) {
        if (specs.children[k].children[0].checked) {
            data.spec = specs.children[k].children[0].value;
            spec = specs.children[k].children[0].value;
            specName = specs.children[k].children[1].getAttribute("specnamereference");
        }
    }
    for (let p = 0; p < difficulty.children.length; p++) {
        if (difficulty.children[p].children[0].checked) {
            data.difficulty = difficulty.children[p].children[0].value;
            selectedDifficulty = difficulty.children[p].children[0].value;
        }
    }
    for (let t = 0; t < metric.children.length; t++) {
        if (metric.children[t].children[0].checked) {
            data.metric = metric.children[t].children[0].value;
            selectedMetric = metric.children[t].children[0].value;
        }
    }
    data.pages = document.getElementById("number-of-pages").value;
    // console.log(data);
    return data;
}
// #endregion

// #region create HTML elements

//creates a spec radio with all the relevant attributes
function createSpecElement(spec, specName, parent, idNumber) {
    let parentDiv = document.createElement("div");
    parentDiv.className = "custom-control custom-radio custom-control-inline";
    let elmnt1 = createRadioElement("spec", spec, "customRadioInline", idNumber);
    let label1 = createLabelElement(specName, idNumber, specName);
    parentDiv.appendChild(elmnt1);
    parentDiv.appendChild(label1);
    parent.appendChild(parentDiv);

}

function createLabelElement(text, idNumber, specName) {
    let element = document.createElement("label");
    element.className = "custom-control-label";
    element.setAttribute("for", `customRadioInline${idNumber}`);
    if (specName)
        element.setAttribute("specNameReference", specName);
    element.innerHTML = text;
    if (text == "Shadow" && idNumber == 43) {
        element.innerHTML = "Subtlety";
        element.setAttribute("specNameReference", "Subtlety");

    }
    return element;
}

function createRadioElement(name, value, id, idNumber, specName) {
    let element = document.createElement("input");
    element.className = "custom-control-input";
    element.type = "radio";
    element.name = name;
    element.value = value;
    if (specName)
        element.setAttribute("specNameReference", specName);
    element.id = `${id}${idNumber}`;
    element.addEventListener("click", completeDataTest);
    return element;
}

function refreshBossHTML() {
    const bosses = document.getElementById("bosses");
    while (bosses.hasChildNodes()) {
        bosses.removeChild(bosses.firstChild);
    }
    const encounters = raid.raid.encounters;
    let label = document.createElement("h2");
    label.innerHTML = "Boss";
    bosses.appendChild(label);
    for (let i = 0; i < encounters.length; i++) {
        let parentDiv = document.createElement("div");
        parentDiv.className = "custom-control custom-radio custom-control-inline";
        let id = encounters[i].id;
        parentDiv.id = id;
        let boss = createRadioElement("encounter", encounters[i].name, "customRadioInline", id);
        let bossLabel = createLabelElement(encounters[i].name, id);
        parentDiv.appendChild(boss);
        parentDiv.appendChild(bossLabel);
        bosses.appendChild(parentDiv);
    }
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
                        wowheadLink.type = "button";
                        wowheadLink.className = "btn btn-info";
                        if (checkType == "spell")
                            wowheadLink.innerHTML = getTalentNameByID(value);
                        else
                            wowheadLink.innerHTML = getTrinketNameByID(value);

                        let wowString = `${checkType}=${value}`
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
    azeriteDiv.style.display = "block";
    essenceDiv.style.display = "block";
    talentData = getTalentCombos();
    talentCombinations = [];
    talentScore = [];
    ilvlScore = [];
    (Object.values(talentData)).forEach((elt) => { talentCombinations.push(elt[0]) });
    (Object.values(talentData)).forEach((elt) => { talentScore.push(elt[1]) });
    (Object.values(talentData)).forEach((elt) => { ilvlScore.push(elt[2]) });
    talentLabels = getTalentLabels(talentData);
    talentChart.data.labels = talentLabels;
    talentChart.data.datasets = [];
    let barDataSet = {
        label: 'Number of Logs',
        yAxisID: 'A',
        data: talentCombinations,
        backgroundColor: internalBarColors,
        borderColor: barColors,
        borderWidth: 1
    };
    talentChart.data.datasets.push(barDataSet);
    let lineDataSet = {
        label: "DPS/HPS",
        data: talentScore,
        yAxisID: "C",
        type: "line",
        pointRadius: 1.5,
        pointBackgroundColor: barColors,
        pointBorderColor: barColors,
        borderColor: "rgba(255,0,0,0.6)",
        lineTension: 0.5,
        fill: true
    };
    talentChart.data.datasets.push(lineDataSet);
    let ilvlDataSet = {
        label: "ItemLevel",
        yAxisID: 'B',
        data: ilvlScore,
        type: "line",
        pointBackgroundColor: barColors,
        pointBorderColor: barColors,
        borderColor: "rgba(0,0,255,0.2)",
        lineTension: 0.5,
        pointStyle: "star",
        fill: false
    };
    talentChart.data.datasets.push(ilvlDataSet);
    createWowheadDiv(talentData, "wowhead-spell", "spell");
    talentChart.update();

    trinketData = getTrinketCombos();
    trinketCombinations = [];
    trinketScore = [];
    ilvlScore = [];
    (Object.values(trinketData)).forEach((elt) => { trinketCombinations.push(elt[0]) });
    (Object.values(trinketData)).forEach((elt) => { trinketScore.push(elt[1]) });
    (Object.values(trinketData)).forEach((elt) => { ilvlScore.push(elt[2]) });

    trinketLabels = getTrinketLabels(trinketData);
    trinketChart.data.labels = trinketLabels;
    trinketChart.data.datasets = [];
    barDataSet = {
        label: 'Number of Logs',
        yAxisID: 'A',
        data: trinketCombinations,
        backgroundColor: internalBarColors,
        borderColor: barColors,
        borderWidth: 1
    };
    trinketChart.data.datasets.push(barDataSet);
    lineDataSet = {
        label: "DPS/HPS",
        data: trinketScore,
        yAxisID: "C",
        pointRadius: 1.5,
        type: "line",
        pointBackgroundColor: barColors,
        pointBorderColor: barColors,
        borderColor: "rgba(255,0,0,0.6)",
        lineTension: 0.5,
        fill: true
    };
    trinketChart.data.datasets.push(lineDataSet);
    let ilvlTrinketDataSet = {
        label: "ItemLevel",
        yAxisID: 'B',
        data: ilvlScore,
        type: "line",
        pointBackgroundColor: barColors,
        pointBorderColor: barColors,
        borderColor: "rgba(0,0,255,0.2)",
        lineTension: 0.5,
        pointStyle: "star",
        fill: false
    };
    trinketChart.data.datasets.push(ilvlTrinketDataSet);

    trinketChart.update();


    createWowheadDiv(trinketData, "wowhead-item", "item");
    azeriteOccurences = getAzeriteOccurences();
    azeriteRingThreeCombinations = azeriteOccurences[2];
    azeriteRingThreeLabels = getAzeriteLabels(azeriteOccurences, 2);

    azeriteThreeChart.data.datasets[0].data = Object.values(azeriteRingThreeCombinations).slice(0, 10);
    azeriteThreeChart.data.labels = azeriteRingThreeLabels.slice(0, 10);
    azeriteThreeChart.update();

    azeriteRingTwoCombinations = azeriteOccurences[1];
    azeriteRingTwoLabels = getAzeriteLabels(azeriteOccurences, 1);
    azeriteTwoChart.data.datasets[0].data = Object.values(azeriteRingTwoCombinations).slice(0, 10);
    azeriteTwoChart.data.labels = azeriteRingTwoLabels.slice(0, 10);
    azeriteTwoChart.update();

    azeriteRingOneCombinations = azeriteOccurences[0];
    azeriteRingOneLabels = getAzeriteLabels(azeriteOccurences, 0);
    azeriteOneChart.data.datasets[0].data = Object.values(azeriteRingOneCombinations).slice(0, 10);
    azeriteOneChart.data.labels = azeriteRingOneLabels.slice(0, 10);

    essenceData=getEssenceData();
    majorEssenceCombinations=essenceData[0];
    majorEssenceLabels=getEssenceLabels(essenceData,0);
    majorEssenceChart.data.datasets[0].data=Object.values(majorEssenceCombinations);
    majorEssenceChart.data.labels=majorEssenceLabels;
    majorEssenceChart.update();

    minorEssenceCombinations=essenceData[1];
    minorEssenceLabels=getEssenceLabels(essenceData,1);
    minorEssenceChart.data.datasets[0].data=Object.values(minorEssenceCombinations);
    minorEssenceChart.data.labels=minorEssenceLabels;
    minorEssenceChart.update();

    fillTalentSelectionForm();
    talentSelectionDiv.style.display = "block";

}
//same as showData but used when the user requests talent-specific data
function createDataWithTalentsChart() {
    trinketCombosWithTalents = [];
    trinketScoreWithTalents = [];
    ilvlWithTalents = [];
    (Object.values(trinketWithTalentsData)).forEach((elt) => { trinketCombosWithTalents.push(elt[0]) });
    (Object.values(trinketWithTalentsData)).forEach((elt) => { trinketScoreWithTalents.push(elt[1]) });
    (Object.values(trinketWithTalentsData)).forEach((elt) => { ilvlWithTalents.push(elt[2]) });

    trinketsWithTalentsLabels = getTrinketLabels(trinketWithTalentsData);
    trinketsWithTalentsChart.data.labels = trinketsWithTalentsLabels;
    trinketsWithTalentsChart.data.datasets = [];
    barDataSet = {
        label: 'Number of Logs',
        yAxisID: 'A',
        data: (trinketCombosWithTalents),
        backgroundColor: internalBarColors,
        borderColor: barColors,
        borderWidth: 1
    };
    trinketsWithTalentsChart.data.datasets.push(barDataSet);
    lineDataSet = {
        label: "DPS/HPS",
        data: trinketScoreWithTalents,
        type: "line",
        pointBackgroundColor: barColors,
        yAxisID: "C",
        pointBorderColor: barColors,
        borderColor: "rgba(255,0,0,0.6)",
        lineTension: 0.5,
        fill: true
    };
    ilvlTrinketDataSet = {
        label: "ItemLevel",
        yAxisID: 'B',
        data: ilvlWithTalents,
        type: "line",
        pointBackgroundColor: barColors,
        pointBorderColor: barColors,
        borderColor: "rgba(0,0,255,0.2)",
        lineTension: 0.5,
        pointStyle: "star",
        fill: false
    };
    trinketsWithTalentsChart.data.datasets.push(lineDataSet);
    trinketsWithTalentsChart.data.datasets.push(ilvlTrinketDataSet);
    trinketsWithTalentsChart.update();
    createWowheadDiv(trinketWithTalentsData, "wowhead-trinkets-with-talents", "item");
    let azeriteWithTalentsOccurences = getAzeriteOccurencesWithTalents(talentsSelectedIDs);

    let azeriteWithTalentsRingThreeCombinations = azeriteWithTalentsOccurences[2];
    let azeriteWithTalentsRingThreeLabels = getAzeriteLabels(azeriteWithTalentsOccurences, 2);

    azeriteWTalentsThreeChart.data.datasets[0].data = Object.values(azeriteWithTalentsRingThreeCombinations).slice(0, 10);
    azeriteWTalentsThreeChart.data.labels = azeriteWithTalentsRingThreeLabels.slice(0, 10);
    azeriteWTalentsThreeChart.update();

    let azeriteWithTalentsRingTwoCombinations = azeriteWithTalentsOccurences[1];
    let azeriteWithTalentsRingTwoLabels = getAzeriteLabels(azeriteWithTalentsOccurences, 1);

    azeriteWTalentsTwoChart.data.datasets[0].data = Object.values(azeriteWithTalentsRingTwoCombinations).slice(0, 10);
    azeriteWTalentsTwoChart.data.labels = azeriteWithTalentsRingTwoLabels.slice(0, 10);
    azeriteWTalentsTwoChart.update();

    let azeriteWithTalentsRingOneCombinations = azeriteWithTalentsOccurences[0];
    let azeriteWithTalentsRingOneLabels = getAzeriteLabels(azeriteWithTalentsOccurences, 0);

    azeriteWTalentsOneChart.data.datasets[0].data = Object.values(azeriteWithTalentsRingOneCombinations).slice(0, 10);
    azeriteWTalentsOneChart.data.labels = azeriteWithTalentsRingOneLabels.slice(0, 10);
    azeriteWTalentsOneChart.update();


    majorEssenceWithTalentsChart.data.datasets[0].data=Object.values(essencesWithTalentsData[0]).slice(0,10);
    majorEssenceWithTalentsChart.data.labels=getEssenceLabels(essencesWithTalentsData,0).slice(0,10);
    majorEssenceWithTalentsChart.update();

    trinketsWithTalentsDiv.style.display = "block";
    azeriteWithTalentsDiv.style.display = "block";
    essencesWithTalentsDiv.style.display="block";


}

//create the talent rows from the talents we got from the rankings
function fillTalentSelectionForm() {
    for (let i = 0; i < talentsSelected.children.length; i++) {
        if (talentsSelected.children[i].nodeName == "DIV" && talentsSelected.children[i].className == "btn-group") {
            while (talentsSelected.children[i].children[0].hasChildNodes()) {
                talentsSelected.children[i].children[0].removeChild(talentsSelected.children[i].children[0].firstChild);
            }
        }

    }

    for (let talent of talentNames) {
        let talentRowDetected;
        for (let blizzClass of Object.values(talentsFromBlizzard)) {
            if (blizzClass.spec_name == specName) {
                for (let talentRows of blizzClass.talents) {
                    for (let singleTalent of talentRows.talents) {
                        if (talent.name == singleTalent.talent.name) {
                            talentRowDetected = getTalentRowByLevel(talentRows.level);
                        }
                    }
                }
            }
        }
        let div = document.getElementById(`talent-row-${talentRowDetected}`);
        let label = document.createElement("a");
        label.className = "btn btn-danger  mr-1";
        let option = document.createElement("input");
        option.type = "radio";
        option.autocomplete = "off";
        option.name = "talent" + talentRowDetected;
        label.name = "talent" + talentRowDetected;
        label.href = "#";
        label.setAttribute("data-wowhead", `spell=${talent.id}`);
        option.value = talent.id;

        label.innerHTML = talent.name;
        label.appendChild(option);
        if (div)
            div.appendChild(label);
    }


}

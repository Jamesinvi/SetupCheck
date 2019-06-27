let raid;
let specRadios;
let rankingsData;
let talentNames = [];
let trinketNames = [];
let azeriteNames = [];
let talentScore = [];
let trinketScore = [];
let talentCombinations;
let trinketCombinations;
let azeriteOccurences;
let azeriteRingOneCombinations;
let azeriteRingTwoCombinations;
let azeriteRingThreeCombinations;
let barColors = [];
let internalBarColors = [];
let talentLabels = [];
let debug = false;
let classes;
let difficultyFlag = false;
let classFlag = false;
let metricFlag = false;
let specFlag = false;
let bossFlag = false;

function log(message) {
    if (debug) {
        // // console.log(message);
    }
}
// #region buttons & HTML elements
//get all buttons by ID
let button_1 = document.getElementById("submit-cos");
let button_2 = document.getElementById("submit-bod");
let button_3 = document.getElementById("request");

button_3.setAttribute("disabled", true);

let slider = document.getElementById("number-of-pages");
let output = document.getElementById("number-of-pages-header");
let talentsDiv = document.getElementById("talentsDiv");
let trinektsDiv = document.getElementById("trinketsDiv");
let azeriteDiv = document.getElementById("azeriteDiv");
classes = document.getElementById("classes");

for (let difficultyChild of difficulty.children) {
    difficultyChild.children[0].addEventListener("click", completeDataTest);
}
for (let metricChild of metric.children) {
    metricChild.children[0].addEventListener("click", completeDataTest);
}
for (let individualClass of classes.children) {
    individualClass.children[0].addEventListener("click", completeDataTest);
}

talentsDiv.style.display = "none";
trinektsDiv.style.display = "none";
azeriteDiv.style.display = "none";
output.innerHTML = `Number of pages: ${slider.value}`; // Display the default slider value



// #endregion

// #region event listeners

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
for (let gameClass of classes.childNodes) {
    if (gameClass.nodeName == "DIV") {
        gameClass.addEventListener("click", function (evt) {
            updateRadioElements(gameClass.childNodes[1].value);
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
        createSpecElement(2, "Combat", specRadios, 42);
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
    console.log(rankingsData);
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
function compileRequestData() {
    let data = {};
    const bosses = document.getElementById("bosses");
    const specs = document.getElementById("specs");
    const difficulty = document.getElementById("difficulty");
    const metric = document.getElementById("metric");
    for (let i = 1; i < bosses.children.length; i++) {
        if (bosses.children[i].children[0].checked) {
            data.boss = bosses.children[i].id;
        }
    }
    for (let j = 0; j < classes.children.length; j++) {
        if (classes.children[j].children[0].checked) {
            data.class = classes.children[j].children[0].value;

        }
    }
    for (let k = 0; k < specs.children.length; k++) {
        if (specs.children[k].children[0].checked) {
            data.spec = specs.children[k].children[0].value;
        }
    }
    for (let p = 0; p < difficulty.children.length; p++) {
        if (difficulty.children[p].children[0].checked) {
            data.difficulty = difficulty.children[p].children[0].value;
        }
    }
    for (let t = 0; t < metric.children.length; t++) {
        if (metric.children[t].children[0].checked) {
            data.metric = metric.children[t].children[0].value;
        }
    }
    data.pages = document.getElementById("number-of-pages").value;
    // console.log(data);
    return data;
}
// #endregion

// #region create HTML elements
function createSpecElement(spec, specName, parent, idNumber) {
    let parentDiv = document.createElement("div");
    parentDiv.className = "custom-control custom-radio custom-control-inline";
    let elmnt1 = createRadioElement("spec", spec, "customRadioInline", idNumber);
    let label1 = createLabelElement(specName, idNumber);
    parentDiv.appendChild(elmnt1);
    parentDiv.appendChild(label1);
    parent.appendChild(parentDiv);

}

function createLabelElement(text, idNumber) {
    let element = document.createElement("label");
    element.className = "custom-control-label";
    element.setAttribute("for", `customRadioInline${idNumber}`);
    element.innerHTML = text;
    return element;
}

function createRadioElement(name, value, id, idNumber) {
    let element = document.createElement("input");
    element.className = "custom-control-input";
    element.type = "radio";
    element.name = name;
    element.value = value;
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
    let occurences = Object.values(elements).sort((a, b) => b - a).slice(0, 5);
    for (let occurenceCheck of occurences) {
        for (let n = 0; n < Object.keys(elements).length; n++) {
            let occurence = Object.values(elements)[n];
            if (occurenceCheck == occurence) {
                let IDs = Object.keys(elements)[n].split(",");
                let talentSet = document.createElement("div");
                talentSet.setAttribute("class","btn-group");
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

// #region process the data we got

//Object.keys(talentCombinations)
//Object.values(talentCombinations)
var ctx = document.getElementById('talentChart').getContext('2d');
let talentChart;
var ctx2 = document.getElementById('trinketChart').getContext('2d');
let trinketChart;
var ctx3 = document.getElementById('azeriteOneChart').getContext('2d');
let azeriteOneChart;
var ctx4 = document.getElementById('azeriteTwoChart').getContext('2d');
let azeriteTwoChart;
var ctx5 = document.getElementById('azeriteThreeChart').getContext('2d');
let azeriteThreeChart;
window.onload = function () {
    randomBarColors();
    talentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true, //this will remove only the label
                        fontColor: 'white'
                    }
                }],
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: 'white' //set your desired color
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
    trinketChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '# of Logs',
                data: [],
                backgroundColor: internalBarColors,
                borderColor: barColors,
                borderWidth: 1
            }]
        },
        options: {
            pan: {
                enabled: true,
                mode: 'x',
             },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true, //this will remove only the label
                        fontColor: 'white'
                    }
                }],
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: 'white' //set your desired color
                }
            },
            responsive: true,
            maintainAspectRatio: false,


        }

    });
    azeriteOneChart = new Chart(ctx3, {
        type: 'pie',
        data: {
            datasets: [{
                data: [],
                backgroundColor: internalBarColors,
            }],
            labels: [],
        },
        options: {
            pan: {
                enabled: true,
                mode: 'x',
             },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true
                },
                position: 'left',
            },
            responsive: true,
            maintainAspectRatio: false,
        }

    });
    azeriteTwoChart = new Chart(ctx4, {
        type: 'pie',
        data: {
            datasets: [{
                data: [],
                backgroundColor: internalBarColors,
            }],
            labels: [],
        },
        options: {
            legend: {
                pan: {
                    enabled: true,
                    mode: 'x',
                 },
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true
                },
                position: 'right',
            },
            responsive: true,
            maintainAspectRatio: false,
        }

    });
    azeriteThreeChart = new Chart(ctx5, {
        type: 'pie',
        data: {
            datasets: [{
                data: [],
                backgroundColor: internalBarColors,
            }],
            labels: [],
        },
        options: {
            pan: {
                enabled: true,
                mode: 'x',
             },
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true
                },
                position: 'bottom',
            },
            responsive: true,
            maintainAspectRatio: false,
        }

    });
}
function showData() {
    talentsDiv.style.display = "block";
    trinektsDiv.style.display = "block";
    azeriteDiv.style.display = "block";
    talentCombinations = getTalentCombos();
    talentLabels = getTalentLabels();
    talentChart.data.labels = talentLabels;
    talentChart.data.datasets = [];
    let barDataSet = {
        label: 'Number of Logs',
        data: Object.values(talentCombinations),
        backgroundColor: internalBarColors,
        borderColor: barColors,
        borderWidth: 1
    };
    talentChart.data.datasets.push(barDataSet);
    let lineDataSet = {
        label: "Score",
        data: talentScore,
        type: "line",
        pointBackgroundColor: barColors,
        pointBorderColor: barColors,
        borderColor: "white",
        lineTension: 0.5,
        fill: false
    };
    talentChart.data.datasets.push(lineDataSet);
    createWowheadDiv(talentCombinations, "wowhead-spell", "spell");
    talentChart.update();


    trinketCombinations = getTrinketCombos();
    trinketLabels = getTrinketLabels();
    trinketChart.data.labels = trinketLabels;
    trinketChart.data.datasets = [];
    barDataSet = {
        label: 'Number of Logs',
        data: Object.values(trinketCombinations),
        backgroundColor: internalBarColors,
        borderColor: barColors,
        borderWidth: 1
    };
    trinketChart.data.datasets.push(barDataSet);
    lineDataSet = {
        label: "Score",
        data: trinketScore,
        type: "line",
        pointBackgroundColor: barColors,
        pointBorderColor: barColors,
        borderColor: "white",
        lineTension: 0.5,
        fill: false
    };
    trinketChart.data.datasets.push(lineDataSet);
    trinketChart.update();


    createWowheadDiv(trinketCombinations, "wowhead-item", "item");
    azeriteOccurences = getAzeriteOccurences();
    azeriteRingThreeCombinations = azeriteOccurences[2];
    azeriteRingThreeLabels = getAzeriteLabels(2);

    azeriteThreeChart.data.datasets[0].data = Object.values(azeriteRingThreeCombinations);
    azeriteThreeChart.data.labels = azeriteRingThreeLabels;
    azeriteThreeChart.update();

    azeriteRingTwoCombinations = azeriteOccurences[1];
    azeriteRingTwoLabels = getAzeriteLabels(1);
    azeriteTwoChart.data.datasets[0].data = Object.values(azeriteRingTwoCombinations);
    azeriteTwoChart.data.labels = azeriteRingTwoLabels;
    azeriteTwoChart.update();

    azeriteRingOneCombinations = azeriteOccurences[0];
    azeriteRingOneLabels = getAzeriteLabels(0);
    azeriteOneChart.data.datasets[0].data = Object.values(azeriteRingOneCombinations);
    azeriteOneChart.data.labels = azeriteRingOneLabels;
    azeriteOneChart.update();




    // // console.log("trinket combos:");
    // // console.log(trinketCombinations);
    // // console.log("trinketNames:");
    // // console.log(trinketNames);
    // // console.log("trinketLabels:");
    // // console.log(trinketLabels);
    // // console.log("talent combos:");
    // // console.log(talentCombinations);
    // // console.log("talentNames:");
    // // console.log(talentNames);
    // // console.log("talentLabels:");
    // // console.log(talentLabels);

}

function getTalentCombos() {
    let combos = {};
    let scoreValues = [];
    talentScore = [];
    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            let rank = rankingsData[i].rankings[j];
            let talentCombo = [];
            rank.talents.forEach(function (talent) {
                talentCombo.push(talent.id);
                talentNames.push(talent);
            });
            if (!(talentCombo in combos)) {
                combos[talentCombo] = 1;
                let score = rank.total;
                scoreValues.push(score);
            } else {
                combos[talentCombo]++;
            }
        }
    }
    let unique = getUnique(talentNames, 'name');
    talentNames = unique;
    clean(combos);
    let max = Math.max(...scoreValues);
    let min = Math.min(...scoreValues);
    let newMax = Math.max(...Object.values(combos));
    for (let value of scoreValues) {
        let comboRemapped = map_range(value, min, max, 0, newMax);
        talentScore.push(comboRemapped);
    }
    return combos;

}
function getTrinketCombos() {
    let combos = {};
    let trinketValues = [];
    trinketScore=[];
    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            let rank = rankingsData[i].rankings[j];
            let trinketCombo = [];
            for (let k = 12; k < 14; k++) {
                trinketCombo.push(rank.gear[k].id);
                trinketNames.push(rank.gear[k])
            }
            trinketComboPermutations = permutations(trinketCombo);
            let presentFlag = false;
            for (let permutation of trinketComboPermutations) {
                if (permutation in combos) {
                    combos[permutation]++;
                    presentFlag = true;
                }
                // if(!(trinketCombo in combos)){
                //     combos[trinketCombo]=1;
                // }else{
                //     combos[trinketCombo]++;
                // }
            }
            if (presentFlag == false) {
                combos[trinketComboPermutations[0]] = 1;
                trinketValues.push(rank.total);
            }

        }

    }
    let unique = getUnique(trinketNames, "name");
    trinketNames = unique;
    clean(combos);
    let max = Math.max(...trinketValues);
    let min = Math.min(...trinketValues);
    let newMax = Math.max(...Object.values(combos));
    for (let value of trinketValues) {
        let comboRemapped = map_range(value, min, max, 0, newMax);
        trinketScore.push(comboRemapped);
    }
    return combos;

}
function getAzeriteOccurences() {
    let ringOneOccurences = {};
    let ringTwoOccurences = {};
    let ringThreeOccurences = {};
    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            let rank = rankingsData[i].rankings[j];
            for (let k of rank.azeritePowers) {
                if (k.ring == 1) {
                    if (!(k.id in ringOneOccurences)) {
                        ringOneOccurences[k.id] = 1;
                    } else {
                        ringOneOccurences[k.id]++;
                    }
                }
                else if (k.ring == 2) {
                    if (!(k.id in ringTwoOccurences)) {
                        ringTwoOccurences[k.id] = 1;
                    } else {
                        ringTwoOccurences[k.id]++;
                    }
                }
                else if (k.ring == 3) {
                    if (!(k.id in ringThreeOccurences)) {
                        ringThreeOccurences[k.id] = 1;
                    } else {
                        ringThreeOccurences[k.id]++;
                    }
                }

                azeriteNames.push(k);
            }
        }

    }
    const unique = getUnique(azeriteNames, "name");
    azeriteNames = unique;
    clean(ringOneOccurences);
    clean(ringTwoOccurences);
    clean(ringTwoOccurences);
    const occurences = [ringOneOccurences, ringTwoOccurences, ringThreeOccurences];
    return occurences;

}

function getAzeriteLabels(ring) {
    let privateLabels = [];
    for (let occurence of Object.keys(azeriteOccurences[ring])) {
        for (let nameRef of azeriteNames) {
            if (occurence == nameRef.id) {
                privateLabels.push(nameRef.name);
            }
        }
    }
    return privateLabels;
}

function getTalentLabels() {
    let privateLabels = [];
    for (let combo of Object.keys(talentCombinations)) {
        let individualTalents = combo.split(",");
        let individualLabel = [];
        for (let talent of individualTalents) {
            for (let nameRef of talentNames) {
                if (talent == nameRef.id) {
                    individualLabel.push(nameRef.name);
                }
            }
        }
        privateLabels.push(individualLabel);
    }
    privateLabels = privateLabels.filter(n => n)
    return privateLabels;
}
function getTrinketLabels() {
    let privateLabels = [];

    for (let combo of Object.keys(trinketCombinations)) {
        let individualTrinkets = combo.split(",");
        let individualLabel = [];
        for (let trinket of individualTrinkets) {
            for (nameRef of trinketNames) {
                if (trinket == nameRef.id) {
                    individualLabel.push(nameRef.name);
                    if (trinket == 166418) {
                        individualLabel.push("Crest of Pa'ku");
                    }
                }
            }
        }
        privateLabels.push(individualLabel);
    }
    return privateLabels;
}
function getTalentNameByID(id) {
    for (let name of Object.values(talentNames)) {
        if (name.id == id) {
            return name.name;
        }
    }
    return null;
}
function getTrinketNameByID(id) {
    for (let name of Object.values(trinketNames)) {
        if (name.id == id) {
            return name.name;
        }
    }
    return null;
}
function randomBarColors() {
    for (let i = 0; i < 255; i++) {
        let hue = randomColor({
            format: 'rgba',
            alpha: 1
        })
        var lowAlphaHue = hue.replace(", 1)", ", 0.7)");
        barColors.push(hue);
        internalBarColors.push(lowAlphaHue);
    }
}
function getUnique(arr, comp) {

    const unique = arr
        .map(e => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);

    return unique;
}
function removeNull(elt) {
    return elt != null;
}
function permutations(list) {
    // Empty list has one permutation
    if (list.length == 0)
        return [[]];


    var result = [];

    for (var i = 0; i < list.length; i++) {
        // Clone list (kind of)
        var copy = Object.create(list);

        // Cut one element from list
        var head = copy.splice(i, 1);

        // Permute rest of list
        var rest = permutations(copy);

        // Add head to each permutation of rest of list
        for (var j = 0; j < rest.length; j++) {
            var next = head.concat(rest[j]);
            result.push(next);
        }
    }

    return result;
}
function clean(obj) {
    for (var propName in obj) {
        if (propName === null || propName === undefined || propName == ",,,,,," || propName == "," || propName == "") {
            delete obj[propName];
        }
    }
}
function map_range(value, low1, high1, low2, high2) {
    let remapped = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    return remapped;
}
// #endregion
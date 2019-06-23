let raid;
let specRadios;
let rankingsData;
let talentNames=[];
let trinketNames=[];
let talentCombinations;
let trinketCombinations;
let barColors=[];
let internalBarColors=[];
let talentLabels=[];
let debug=false;
function log(message){
    if(debug){
        // console.log(message);
    }
}
// #region buttons
//get all buttons by ID
let button_1=document.getElementById("submit-cos");
let button_2=document.getElementById("submit-bod");
let button_3=document.getElementById("request");
// #endregion

// #region event listeners

//get the classes form and add an event listener to all of the radio elements
let classes=document.getElementById("classes");
for (let i=0;i<classes.length;i++){
    classes[i].addEventListener("click",function(evt){
        updateRadioElements(this.value);
    });
}

//add event listeners to all buttons
button_1.addEventListener("click",function(evt){
    submitForm(this.value);
});

button_2.addEventListener("click",function(evt){
    submitForm(this.value);
});

//special listener to request encounter data
button_3.addEventListener("click", async function(){
    button_3.disabled=true;
    let data=compileRequestData();
    requestRankings(data);

})

//based on what class is selected create radios and labels for specs
function updateRadioElements(evt){
    const gameclass=evt;
    specRadios=document.getElementById("specs");
    while(specRadios.hasChildNodes()){
        specRadios.removeChild(specRadios.firstChild);
    }
    if(gameclass=="1"){
       createSpecElement(1,"Blood",specRadios);
       createSpecElement(2,"Frost",specRadios);
       createSpecElement(3,"Unholy",specRadios);
    }
    if(gameclass=="2"){
       createSpecElement(1,"Balance",specRadios);
       createSpecElement(2,"Feral",specRadios);
       createSpecElement(3,"Guardian",specRadios);
       createSpecElement(4,"Restoration",specRadios);
    }
    if(gameclass=="3"){
       createSpecElement(1,"Beast Mastery",specRadios);
       createSpecElement(2,"Marksmanship",specRadios);
       createSpecElement(3,"Survival",specRadios);
    }
    if(gameclass=="4"){
       createSpecElement(1,"Arcane",specRadios);
       createSpecElement(2,"Fire",specRadios);
       createSpecElement(3,"Frost",specRadios);
    }
    if(gameclass=="5"){
       createSpecElement(1,"Brewmaster",specRadios);
       createSpecElement(2,"Mistweaver",specRadios);
       createSpecElement(3,"Windwalker",specRadios);
    }
    if(gameclass=="6"){
       createSpecElement(1,"Holy",specRadios);
       createSpecElement(2,"Protection",specRadios);
       createSpecElement(3,"Retribution",specRadios);
    }
    if(gameclass=="7"){
       createSpecElement(1,"Discipline",specRadios);
       createSpecElement(2,"Holy",specRadios);
       createSpecElement(3,"Shadow",specRadios);
    }
    if(gameclass=="8"){
       createSpecElement(1,"Assassination",specRadios);
       createSpecElement(2,"Combat",specRadios);
       createSpecElement(3,"Shadow",specRadios);
       createSpecElement(3,"Outlaw",specRadios);
    }
    if(gameclass=="9"){
       createSpecElement(1,"Elemental",specRadios);
       createSpecElement(2,"Enhancement",specRadios);
       createSpecElement(3,"Restoration",specRadios);
    }
    if(gameclass=="10"){
       createSpecElement(1,"Affliction",specRadios);
       createSpecElement(2,"Demonology",specRadios);
       createSpecElement(3,"Destruction",specRadios);
    }
    if(gameclass=="11"){
       createSpecElement(1,"Arms",specRadios);
       createSpecElement(2,"Fury",specRadios);
       createSpecElement(3,"Protection",specRadios);
    }
    if(gameclass=="12"){
       createSpecElement(1,"Havoc",specRadios);
       createSpecElement(2,"Vengeance",specRadios);
    }
}

function submitForm(evt){
    const value=evt;
    let toSend={
        val:value
    }
    requestFights(toSend);
}
// #endregion

// #region request server for data
async function requestRankings(data){
    let timeleft=4;
    //timer to prevent spammin the server
    const options={
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/encounter",options);
    const json = await response.json().then(button_3.disabled=false);
    // console.log("rankings from server:");
    // console.log(json);
    rankingsData=json;
    showData();

}
async function requestFights(data){
    const options={
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
    };
    const response = await fetch("/raid", options);
    const json = await response.json();
    // console.log(json);
    raid=json;
    refreshBossHTML();
}
function compileRequestData(){
    let data={};
    const bosses=document.getElementById("bosses");
    const classes=document.getElementById("classes");
    const specs=document.getElementById("specs");
    const difficulty=document.getElementById("difficulty");
    const metric=document.getElementById("metric");
    for (let i=0;i<bosses.childNodes.length;i++){
        if (bosses.childNodes[i].checked){
            data.boss= bosses.childNodes[i].id;
        }
    }
    for (let j=0;j<classes.childNodes.length;j++){
        if (classes.childNodes[j].checked){
            data.class= classes.childNodes[j].value;

        }
    }
    for (let k=0;k<specs.childNodes.length;k++){
        if (specs.childNodes[k].checked){
            data.spec= specs.childNodes[k].id;
        }
    }
    for (let p=0;p<difficulty.childNodes.length;p++){
        if(difficulty.childNodes[p].checked){
            data.difficulty=difficulty.childNodes[p].value;
        }
    }
    for (let t=0;t<metric.childNodes.length;t++){
        if(metric.childNodes[t].checked){
            data.metric=metric.childNodes[t].value;
        }
    }
    // console.log(data);
    return data;
}
// #endregion

// #region create HTML elements
function createSpecElement(spec,specName,parent){
    let elmnt1=createRadioElement("spec",spec,spec);
    let label1=createLabelElement(specName);
    specRadios.appendChild(elmnt1);
    specRadios.appendChild(label1);
    parent.appendChild(elmnt1);
    parent.appendChild(label1);
}

function createLabelElement(text){
    let element=document.createElement("label");
    element.innerHTML=text;
    return element;
}

function createRadioElement(name,value,id){
    let element=document.createElement("input");
    element.type="radio";
    element.name=name;
    element.value=value;
    element.id=id;
    return element;
}

function refreshBossHTML(){
    const bosses=document.getElementById("bosses");
    while(bosses.hasChildNodes()){
        bosses.removeChild(bosses.firstChild);
    }
    const encounters=raid.raid.encounters;
    for (let i=0;i<encounters.length;i++){
        let id=encounters[i].id;
        let boss=createRadioElement("encounter",encounters[i].name, id);
        let bossLabel = createLabelElement(encounters[i].name);
        bosses.appendChild(boss);
        bosses.appendChild(bossLabel);
    }
}
function createWowheadDiv(elements,parentID, type){
    //get the wowhead div
    let checkType=type;
    let div=document.getElementById(`${checkType}`);
    //if not found create one
    if(div==null){
        div=document.createElement("div");
        div.id=`${checkType}`;
    }else{
        //clear all entries to avoid talent from multiple classes to accumulate
        for (let i=0;i<div.childNodes.length;i++){
            div.childNodes[i].innerHTML="";
            div.childNodes[i].href="";
        }
    }
    let occurences=Object.values(elements).sort((a,b) => b-a).slice(0,5);
    for (let n=0;n<Object.keys(elements).length;n++){
        let IDs=Object.keys(elements)[n].split(",");
        let talentSet=document.createElement("div");
        let occurence=Object.values(elements)[n];
        if(occurences.includes(occurence)){
            for(let value of IDs){
                let wowheadLink=document.createElement("a");
                wowheadLink.href=`https://www.wowhead.com/${checkType}=${value}`;
                if(checkType=="spell")
                wowheadLink.innerHTML=getTalentNameByID(value) + ", ";
                else
                wowheadLink.innerHTML=getTrinketNameByID(value) + ", ";

                let wowString=`${checkType}=${value}`
                wowheadLink.setAttribute = wowString;
                talentSet.appendChild(wowheadLink);
            }
            div.appendChild(talentSet);
        }   

    }
    let parent=document.getElementById(parentID);
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
window.onload=function(){
    randomBarColors();
    talentChart = new Chart(ctx, {
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
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            },
            responsive : true,
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
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        display: false //this will remove only the label
                    }
                }]
            },
            responsive : true,
            maintainAspectRatio: false
        }
    });
}
function showData(){
    talentCombinations=getTalentCombos();
    talentLabels=getTalentLabels();
    talentChart.data.labels=talentLabels;
    talentChart.data.datasets[0].data=Object.values(talentCombinations);
    createWowheadDiv(talentCombinations,"wowhead-spell","spell");
    talentChart.update();
    trinketCombinations=getTrinketCombos();
    trinketLabels=getTrinketLabels();
    trinketChart.data.labels=trinketLabels;
    trinketChart.data.datasets[0].data=Object.values(trinketCombinations);
    trinketChart.update();
    createWowheadDiv(trinketCombinations,"wowhead-item","item");
    // console.log("trinket combos:");
    // console.log(trinketCombinations);
    // console.log("trinketNames:");
    // console.log(trinketNames);
    // console.log("trinketLabels:");
    // console.log(trinketLabels);
    // console.log("talent combos:");
    // console.log(talentCombinations);
    // console.log("talentNames:");
    // console.log(talentNames);
    // console.log("talentLabels:");
    // console.log(talentLabels);

}


function getTalentCombos(){
    let combos={};
    for (let i=0;i<rankingsData.length;i++){
        for(let j=0;j<rankingsData[i].rankings.length;j++){
            let rank=rankingsData[i].rankings[j];
            let talentCombo=[];
            rank.talents.forEach(function (talent){              
                talentCombo.push(talent.id);
                talentNames.push(talent);
            });
            if(!(talentCombo in combos)){
                combos[talentCombo]=1;
            }else{
                combos[talentCombo]++;
            }
        }
    }
    let unique = getUnique(talentNames,'name');
    talentNames=unique;
    clean(combos);
    return combos;

}
function getTrinketCombos(){
    let combos={};
    for (let i=0;i<rankingsData.length;i++){
        for(let j=0;j<rankingsData[i].rankings.length;j++){
            let rank=rankingsData[i].rankings[j];
            let trinketCombo=[];
            for(let k=12;k<14;k++){         
                trinketCombo.push(rank.gear[k].id);
                trinketNames.push(rank.gear[k])
            }
            trinketComboPermutations=permutations(trinketCombo);
            let presentFlag=false;
            for(let permutation of trinketComboPermutations){
                if(permutation in combos){
                    combos[permutation]++;
                    presentFlag=true;
                }
                // if(!(trinketCombo in combos)){
                //     combos[trinketCombo]=1;
                // }else{
                //     combos[trinketCombo]++;
                // }
            }
            if(presentFlag==false){
                combos[trinketComboPermutations[0]]=1;
            }
            
        }
        
    }
    let unique=getUnique(trinketNames,"name");
    trinketNames=unique;
    clean(combos);
    return combos;

}


  
function getTalentLabels(){
    let privateLabels=[];
    for(let combo of Object.keys(talentCombinations)){
        let individualTalents=combo.split(",");
        let individualLabel=[];
        for(let talent of individualTalents){
            for(let nameRef of talentNames){
                if(talent == nameRef.id){
                    individualLabel.push(nameRef.name);
                }
            }
        }
        privateLabels.push(individualLabel);
    }
    privateLabels=privateLabels.filter(n => n)
    return privateLabels;
}
function getTrinketLabels(){
    let privateLabels=[];

    for (let combo of Object.keys(trinketCombinations)){
        let individualTrinkets=combo.split(",");
        let individualLabel=[];
        for(let trinket of individualTrinkets){
            for(nameRef of trinketNames){
                if(trinket ==nameRef.id){
                    individualLabel.push(nameRef.name);
                    if(trinket==166418){
                        individualLabel.push("Crest of Pa'ku");
                    }
                }
            }
        }
        privateLabels.push(individualLabel);
    }
    return privateLabels;
}
function getTalentNameByID(id){
    for (let name of Object.values(talentNames)){
        if(name.id==id){
            return name.name;
        }
    }
    return null;
}
function getTrinketNameByID(id){
    for (let name of Object.values(trinketNames)){
        if(name.id==id){
            return name.name;
        }
    }
    return null;
}
function randomBarColors(){
    for (let i=0;i<255;i++){
        var hue = 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + 1 + ')';
        var lowAlphaHue=hue.replace(",1)", ",0.33)");
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
  function permutations(list)
{
	// Empty list has one permutation
	if (list.length == 0)
		return [[]];
		
		
	var result = [];
	
	for (var i=0; i<list.length; i++)
	{
		// Clone list (kind of)
		var copy = Object.create(list);

		// Cut one element from list
		var head = copy.splice(i, 1);
		
		// Permute rest of list
		var rest = permutations(copy);
		
		// Add head to each permutation of rest of list
		for (var j=0; j<rest.length; j++)
		{
			var next = head.concat(rest[j]);
			result.push(next);
		}
	}
	
	return result;
}
function clean(obj) {
    for (var propName in obj) {
      if (propName === null || propName === undefined || propName ==",,,,,," || propName==",") {
        delete obj[propName];
      }
    }
  }
  
// #endregion
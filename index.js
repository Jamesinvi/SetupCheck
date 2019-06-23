//imports
const express= require("express");
const fetch= require("node-fetch");
require("dotenv").config();

//init server
const app=express();
//get raids at startup from warcraftLogs
let data;
let raids;
let key=process.env.API_KEY;
let port=process.env.PORT || 3000;
getRaidData();

//fetch raids from warcraftLogs
async function getRaidData(){
    let response=await fetch(`https://www.warcraftlogs.com:443/v1/zones?api_key=${key}`);
    data=await response.json();
    getRaids(data);
}
//fetch rankings data from warcraftLogs
async function getEncounterData(){
    
}
//put all the raids in a variable
function getRaids(data){
    raids=[];
    for(let i=0;i<data.length;i++){
        if(data[i].name.toLowerCase()=="battle of dazar'alor" || data[i].name.toLowerCase()=="crucible of storms"){
            raids.push(data[i]);
        }
    }
    console.log(raids);
}
//return correct raid based on the name
function selectCorrectRaid(value){
    for (let i=0;i<raids.length;i++){
        if(raids[i].name.toLowerCase()==value){
            return raids[i];
        }
    }
}


//startup the socket at port from enviroment
app.listen(port, () => console.log(`listening at port ${port}`));
app.use(express.static("public"));
app.use(express.json({limit: "3mb"}));


//post and get endpoints
app.post("/raid",(request,response)=>{
    console.log("got a raid request");
    console.log(request.body);
    let value=request.body.val;
    const selectedRaid=selectCorrectRaid(value);
    response.json({
        raid: selectedRaid
    });
})
app.post("/encounter", async (request,response)=>{
    console.log("got a fight request: ");
    console.log(request.body);
    let dataToSendBack=[];
    let value=request.body;
    const boss=value.boss;
    const gameclass=value.class;
    const spec=value.spec;
    const metric=value.metric;
    const difficulty=value.difficulty;
    let promise1=rankingData(boss,metric,difficulty,gameclass,spec,1,key);
    let promise2=rankingData(boss,metric,difficulty,gameclass,spec,2,key);
    let promise3=rankingData(boss,metric,difficulty,gameclass,spec,3,key);
    //let promise4=rankingData(boss,metric,difficulty,gameclass,spec,4,key);
    //let promise5=rankingData(boss,metric,difficulty,gameclass,spec,5,key);
    let promises=[promise1,promise2,promise3];
    Promise.all(promises).then((results)=>{
        for (let i=0;i<results.length;i++){
            dataToSendBack.push(results[i]);
        }
        response.end(JSON.stringify(dataToSendBack));
    }).catch((err) => console.log(err));

})
async function rankingData(boss,metric,difficulty,gameclass,spec,page,key){
    let api_url=`https://www.warcraftlogs.com:443/v1/rankings/encounter/${boss}?metric=${metric}&difficulty=${difficulty}&class=${gameclass}&spec=${spec}&page=${page}&api_key=${key}`;
    let fetchResponse=await fetch(api_url);
    let json=await fetchResponse.json();
    return json;
}


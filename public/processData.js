function getTalentRowByLevel(level) {
    let row;
    //Everybody else
    switch (level) {
        case 15:
            row = 1;
            break;
        case 25:
            row = 2;
            break;
        case 30:
            row = 3;
            break;
        case 35:
            row = 4;
            break;
        case 40:
            row = 5;
            break;
        case 45:
            row = 6;
            break;
        case 50:
            row = 7;
            break;
    }
    return row;
}
function getTalentCombos() {
    let combos = {};

    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            const rank = rankingsData[i].rankings[j];
            let talentCombo = [];
            rank.talents.forEach(function (talent) {
                talentCombo.push(talent.id);
                if (talent.id != null)
                    talentNames.push(talent);
            });
            ilvlScore.push(rank.itemLevel);
            if (!(talentCombo in combos)) {
                let score = Math.trunc(rank.total);
                combos[talentCombo] = [1, score, rank.itemLevel];
            } else {
                let score = Math.trunc(rank.total);
                combos[talentCombo][0] += 1;
                combos[talentCombo][2] = parseFloat(((combos[talentCombo][2] + rank.itemLevel) / 2).toFixed(0));
            }
        }
    }
    let unique = getUnique(talentNames, 'name');
    talentNames = unique;
    clean(combos);
    return combos;

}
function getLegendariesCombos() {
    let combos = {};
    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            const rank = rankingsData[i].rankings[j];
            let legendaryEffect = rank.legendaryEffects[0];
            if (legendaryEffect != null) {
                rank.legendaryEffects.forEach(function (legendary) {
                    if (legendary.id != null)
                        legendaryNames.push(legendaryEffect);
                });
                ilvlScore.push(rank.itemLevel);
                if (!(legendaryEffect.id in combos)) {
                    let score = Math.trunc(rank.total);
                    combos[legendaryEffect.id] = [1, score, rank.itemLevel];
                } else {
                    combos[legendaryEffect.id][0] += 1;
                    combos[legendaryEffect.id][2] = parseFloat(((combos[legendaryEffect.id][2] + rank.itemLevel) / 2).toFixed(0));
                }
            }
        }
    }
    let unique = getUnique(legendaryNames, 'name');
    legendaryNames = unique;
    clean(combos);
    return combos;

}
function getTrinketCombos() {
    let combos = {};
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
                    combos[permutation][0]++;
                    combos[permutation][2] = parseFloat(((combos[permutation][2] + rank.itemLevel) / 2).toFixed(0));
                    presentFlag = true;
                }
                // if(!(trinketCombo in combos)){
                //     combos[trinketCombo]=1;
                // }else{
                //     combos[trinketCombo]++;
                // }
            }
            if (presentFlag == false) {
                combos[trinketComboPermutations[0]] = [1, Math.trunc(rank.total), rank.itemLevel];
            }

        }

    }
    let unique = getUnique(trinketNames, "name");
    trinketNames = unique;
    clean(combos);
    return combos;

}
function getCovenantCombos() {
    let combos = {};
    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            const rank = rankingsData[i].rankings[j];
            let covenant = rank.covenantID;
            if (!isNaN(covenant)) {
                if (!(covenant in combos)) {
                    combos[covenant] = [getCovenantNameByID(covenant), 1];
                } else {
                    combos[covenant][1] += 1;
                }
            }
        }
    }
    //remove null name key values. 
    Object.keys(combos).forEach((key) => (combos[key][0] == null) && delete combos[key]);
    clean(combos);
    return combos;
}
function getTrinketCombosWithTalents(talentComboSelected) {
    let combos = {};
    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            const rank = rankingsData[i].rankings[j];
            let trinketCombo = [];
            if (checkEqualTalents(talentComboSelected, rank.talents)) {
                for (let k = 12; k < 14; k++) {
                    trinketCombo.push(rank.gear[k].id);
                }
                trinketComboPermutations = permutations(trinketCombo);
                let presentFlag = false;
                for (let permutation of trinketComboPermutations) {
                    if (permutation in combos) {
                        combos[permutation][0]++;
                        combos[permutation][2] = parseFloat(((combos[permutation][2] + rank.itemLevel) / 2).toFixed(0));
                        presentFlag = true;
                    }
                }
                if (presentFlag == false) {
                    combos[trinketComboPermutations[0]] = [1, rank.total, rank.itemLevel];
                }
            }
        }
    }
    let unique = getUnique(trinketNames, "name");
    trinketNames = unique;
    clean(combos);
    return combos;

}

function getTalentLabels(combos) {
    let privateLabels = [];
    for (let combo of Object.keys(combos)) {
        const individualTalents = combo.split(",");
        let individualLabel = [];
        for (let talent of individualTalents) {
            individualLabel.push(getTalentNameByID(talent));
        }
        individualLabel = individualLabel.join();
        privateLabels.push(individualLabel);
    }
    privateLabels = privateLabels.filter(n => n);
    return privateLabels;
}

function getTrinketLabels(combos) {
    let privateLabels = [];

    for (let combo of Object.keys(combos)) {
        const individualTrinkets = combo.split(",");
        let individualLabel = [];
        for (let trinket of individualTrinkets) {
            individualLabel.push(getTrinketNameByID(trinket));
        }
        individualLabel = individualLabel.join();
        privateLabels.push(individualLabel);
    }
    return privateLabels;
}
function getLegendaryLabels(combos) {
    let privateLabels = [];
    for (let combo of Object.keys(combos)) {
        let individualLabel = getLegendaryNameByID(combo);
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
function getLegendaryNameByID(id) {
    for (let name of Object.values(legendaryNames)) {
        if (name.id == id) {
            return name.name;
        }
    }
    return null;
}
function getCovenantNameByID(id){
    for (let covenant of covenantsFromBlizzard) {
        if (id == covenant.id)
            return covenant.name;
    }
    return null;
}
function checkEqualTalents(talentIDs, talentObject) {
    let talentsOne = talentIDs.split(",");
    let talentsTwo = [];
    talentObject.forEach((element) => {
        let elementValue = Object.values(element)[1];
        if (elementValue != null)
            talentsTwo.push(elementValue.toString());
    });
    for (let i = 0; i < talentsOne.length; i++) {
        if (!(talentsOne[i] == talentsTwo[i]))
            return false;
    }
    return true;
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
        if (propName === null || propName === undefined || propName == ",,,,,," || propName == "," || propName == "" || propName == "Unknown Ability") {
            delete obj[propName];
        }
    }
}
function map_range(value, low1, high1, low2, high2) {
    let remapped = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    return remapped;
}
function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i].name == what.name) {
            count++;
        }
    }
    return count;
}
function resetZoom() {
    if (this.value == 1)
        talentChart.resetZoom();
    if (this.value == 2)
        trinketChart.resetZoom();
    if (this.value == 3)
        trinketsWithTalentsChart.resetZoom();
}
function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}
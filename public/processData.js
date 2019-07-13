function getTalentRowByLevel(level) {
    let row;
    if (gameClass == 12) {
        switch (level) {
            case 99:
                row = 1;
                break;
            case 100:
                row = 2;
                break;
            case 102:
                row = 3;
                break;
            case 104:
                row = 4;
                break;
            case 106:
                row = 5;
                break;
            case 108:
                row = 6;
                break;
            case 110:
                row = 7;
                break;
        }
    } else if (gameClass == 1) {
        switch (level) {
            case 56:
                row = 1;
                break;
            case 57:
                row = 2;
                break;
            case 58:
                row = 3;
                break;
            case 60:
                row = 4;
                break;
            case 75:
                row = 5;
                break;
            case 90:
                row = 6;
                break;
            case 100:
                row = 7;
                break;
        }
    } else {
        switch (level) {
            case 15:
                row = 1;
                break;
            case 30:
                row = 2;
                break;
            case 45:
                row = 3;
                break;
            case 60:
                row = 4;
                break;
            case 75:
                row = 5;
                break;
            case 90:
                row = 6;
                break;
            case 100:
                row = 7;
                break;
        }
    }
    return row;
}
function getTalentCombos() {
    let combos = {};

    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            let rank = rankingsData[i].rankings[j];
            let talentCombo = [];
            rank.talents.forEach(function (talent) {
                talentCombo.push(talent.id);
                if (talent.id != null)
                    talentNames.push(talent);
            });
            ilvlScore.push(rank.itemLevel);
            if (!(talentCombo in combos)) {
                let score = rank.total;
                combos[talentCombo] = [1, score, rank.itemLevel];
            } else {
                combos[talentCombo][0] += 1;
                combos[talentCombo][2] = (combos[talentCombo][2] + rank.itemLevel) / 2;
            }
        }
    }
    let unique = getUnique(talentNames, 'name');
    talentNames = unique;
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
                    combos[permutation][2]=(combos[permutation][2]+rank.itemLevel)/2;
                    presentFlag = true;
                }
                // if(!(trinketCombo in combos)){
                //     combos[trinketCombo]=1;
                // }else{
                //     combos[trinketCombo]++;
                // }
            }
            if (presentFlag == false) {
                combos[trinketComboPermutations[0]] = [1,rank.total,rank.itemLevel];
            }

        }

    }
    let unique = getUnique(trinketNames, "name");
    trinketNames = unique;
    clean(combos);
    return combos;

}
function getTrinketCombosWithTalents(talentComboSelected) {
    let combos = {};
    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            let rank = rankingsData[i].rankings[j];
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
                        combos[permutation][2]=(combos[permutation][2]+rank.itemLevel)/2;
                        presentFlag = true;
                    }
                }
                if (presentFlag == false) {
                    combos[trinketComboPermutations[0]] = [1,rank.total,rank.itemLevel];
                }
            }



        }

    }
    let unique = getUnique(trinketNames, "name");
    trinketNames = unique;
    clean(combos);
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
                    let stackCount = countInArray(rank.azeritePowers, k);
                    if (!(k.id in ringThreeOccurences) && stackCount == 1) {
                        ringThreeOccurences[k.id] = 1;
                    } else if (!(k.id in ringThreeOccurences) && stackCount == 2) {
                        let testString = Number(k.id.toString().concat("222222"));
                        ringThreeOccurences[testString] = 1;
                    } else if (!(k.id in ringThreeOccurences) && stackCount == 3) {
                        let testString = Number(k.id.toString().concat("333333"));
                        ringThreeOccurences[testString] = 1;
                    }
                    else if ((k.id in ringThreeOccurences) && stackCount == 1) {
                        ringThreeOccurences[k.id] += 1;
                    } else if ((Number(k.id.toString().concat("222222")) in ringThreeOccurences) && stackCount == 2) {
                        let testString = Number(k.id.toString().concat("222222"));
                        ringThreeOccurences[testString] += 1;
                    } else if ((Number(k.id.toString().concat("333333")) in ringThreeOccurences) && stackCount == 3) {
                        let testString = Number(k.id.toString().concat("333333"));
                        ringThreeOccurences[testString] += 1;
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
function getAzeriteOccurencesWithTalents() {
    let ringOneOccurences = {};
    let ringTwoOccurences = {};
    let ringThreeOccurences = {};
    for (let i = 0; i < rankingsData.length; i++) {
        for (let j = 0; j < rankingsData[i].rankings.length; j++) {
            let rank = rankingsData[i].rankings[j];
            if (checkEqualTalents(talentsSelectedIDs, rank.talents)) {
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
                        let stackCount = countInArray(rank.azeritePowers, k);
                        if (!(k.id in ringThreeOccurences) && stackCount == 1) {
                            ringThreeOccurences[k.id] = 1;
                        } else if (!(k.id in ringThreeOccurences) && stackCount == 2) {
                            let testString = Number(k.id.toString().concat("222222"));
                            ringThreeOccurences[testString] = 1;
                        } else if (!(k.id in ringThreeOccurences) && stackCount == 3) {
                            let testString = Number(k.id.toString().concat("333333"));
                            ringThreeOccurences[testString] = 1;
                        }
                        else if ((k.id in ringThreeOccurences) && stackCount == 1) {
                            ringThreeOccurences[k.id] += 1;
                        } else if ((Number(k.id.toString().concat("222222")) in ringThreeOccurences) && stackCount == 2) {
                            let testString = Number(k.id.toString().concat("222222"));
                            ringThreeOccurences[testString] += 1;
                        } else if ((Number(k.id.toString().concat("333333")) in ringThreeOccurences) && stackCount == 3) {
                            let testString = Number(k.id.toString().concat("333333"));
                            ringThreeOccurences[testString] += 1;
                        }
                    }

                    azeriteNames.push(k);
                }
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

function getAzeriteLabels(toCheck, ring) {
    let privateLabels = [];
    for (let occurence of Object.entries(toCheck[ring])) {
        for (let nameRef of azeriteNames) {
            if (occurence[0] == nameRef.id) {
                privateLabels.push(nameRef.name.concat(" x1"));
            } else if (occurence[0] == (Number(nameRef.id.toString().concat("222222")))) {
                privateLabels.push(nameRef.name.concat(" x2"));
            } else if (occurence[0] == (Number(nameRef.id.toString().concat("333333")))) {
                privateLabels.push(nameRef.name.concat(" x3"));
            }
        }
    }
    return privateLabels;
}

function getTalentLabels(combos) {
    let privateLabels = [];
    for (let combo of Object.keys(combos)) {
        let individualTalents = combo.split(",");
        let individualLabel = [];
        for (let talent of individualTalents) {
            individualLabel.push(getTalentNameByID(talent));
        }
        individualLabel=individualLabel.join();
        privateLabels.push(individualLabel);
    }
    privateLabels = privateLabels.filter(n => n);
    return privateLabels;
}
function getTrinketLabels(combos) {
    let privateLabels = [];

    for (let combo of Object.keys(combos)) {
        let individualTrinkets = combo.split(",");
        let individualLabel = [];
        for (let trinket of individualTrinkets) {
            individualLabel.push(getTrinketNameByID(trinket));
        }
        individualLabel=individualLabel.join();
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

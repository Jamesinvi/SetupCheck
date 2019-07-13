const ctx = document.getElementById('talentChart').getContext('2d');
let talentChart;
const ctx2 = document.getElementById('trinketChart').getContext('2d');
let trinketChart;
const ctx3 = document.getElementById('azeriteOneChart').getContext('2d');
let azeriteOneChart;
const ctx4 = document.getElementById('azeriteTwoChart').getContext('2d');
let azeriteTwoChart;
const ctx5 = document.getElementById('azeriteThreeChart').getContext('2d');
let azeriteThreeChart;
const ctx6 = document.getElementById('trinketsWithTalentsChart').getContext('2d');
let trinketsWithTalentsChart;
const ctx7 = document.getElementById('azeriteWTalentsThreeChart').getContext('2d');
let azeriteWTalentsThreeChart;
const ctx8 = document.getElementById('azeriteWTalentsTwoChart').getContext('2d');
let azeriteWTalentsTwoChart;
const ctx9 = document.getElementById('azeriteWTalentsOneChart').getContext('2d');
let azeriteWTalentsOneChart;

window.onload = function () {
    randomBarColors();
    talentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'top',
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                    type: "linear"
                }, {
                    ticks: {
                        beginAtZero: false, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'B',
                    type: 'linear',
                    position: 'right',
                }, {
                    ticks: {
                        beginAtZero: false, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'C',
                    type: 'linear',
                    position: 'left',
                }],
                xAxes: [{
                    ticks: {
                        display: false
                    },
                }]
            },
            legend: {
                labels: {
                    fontColor: 'white', //set your desired color
                    fontSize: 18
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: false,
                        mode: 'xy',
                        speed: 1
                    },
                    zoom: {
                        enabled: true,
                        mode: 'xy',
                        drag: true
                    }
                }
            }
        }
    });
    trinketChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'top',
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                    type: "linear"
                },{
                    ticks: {
                        beginAtZero: true, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'C',
                    type: 'linear',
                    position: 'left',
                    type: "linear"
                }, {
                    ticks: {
                        beginAtZero: false, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'B',
                    type: 'linear',
                    position: 'right',
                }],
                xAxes: [{
                    ticks: {
                        display: false
                    },
                    type: "category"
                }]
            },
            legend: {
                labels: {
                    fontColor: 'white', //set your desired color
                    fontSize: 18
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: false,
                        mode: 'y',
                        speed: 1
                    },
                    zoom: {
                        enabled: true,
                        mode: 'xy',
                        drag: true
                    }
                }
            }
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
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true,
                    padding: 5,
                    fontSize: 18
                },
                position: 'bottom',
            },
            responsive: true,
            maintainAspectRatio: false,
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: false,
                    mode: 'xy',
                    speed: 1
                },
                zoom: {
                    enabled: false,
                    mode: 'xy',
                    drag: true
                }
            }
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
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true,
                    padding: 5,
                    fontSize: 18
                },
                position: 'bottom',
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
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true,
                    padding: 5,
                    fontSize: 18
                },
                position: 'bottom',
            },
            responsive: true,
            maintainAspectRatio: false,
        }

    });
    trinketsWithTalentsChart = new Chart(ctx6, {
        type: 'bar',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'top',
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                    type: "linear"
                }, {
                    ticks: {
                        beginAtZero: false, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'B',
                    type: 'linear',
                    position: 'right',
                }, {
                    ticks: {
                        beginAtZero: false, //this will remove only the label
                        fontColor: 'white'
                    },
                    id: 'C',
                    type: 'linear',
                    position: 'left',
                }],
                xAxes: [{
                    ticks: {
                        display: false
                    },
                    type: "category"
                }]
            },
            legend: {
                labels: {
                    fontColor: 'white', //set your desired color
                    fontSize: 18
                }
            },
            plugins: {
                zoom: {
                    pan: {
                        enabled: false,
                        mode: 'xy',
                        speed: 1
                    },
                    zoom: {
                        enabled: true,
                        mode: 'xy',
                        drag: true
                    }
                }
            }
        }
    });
    azeriteWTalentsThreeChart = new Chart(ctx7, {
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
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true,
                    padding: 5,
                    fontSize: 18
                },
                position: 'bottom',
            },
            responsive: true,
            maintainAspectRatio: false,
        }

    });
    azeriteWTalentsTwoChart = new Chart(ctx8, {
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
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true,
                    padding: 5
                },
                position: 'bottom',
            },
            responsive: true,
            maintainAspectRatio: false,
        }

    });
    azeriteWTalentsOneChart = new Chart(ctx9, {
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
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: 'white',
                    usePointStyle: true,
                    padding: 5,
                    fontSize: 18
                },
                position: 'bottom',
            },
            responsive: true,
            maintainAspectRatio: false,
        }

    });
}

function randomBarColors() {
    for (let i = 0; i < 355; i++) {
        let hue = randomColor({
            format: 'rgba',
            alpha: 1
        })
        let lowAlphaHue = hue.replace(", 1)", ", 0.7)");
        barColors.push(hue);
        internalBarColors.push(lowAlphaHue);
    }
}
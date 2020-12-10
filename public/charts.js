var lineOptions = {
    chart: {
      type: 'line',
    },
    series: [{
      name: 'sales',
      data: [30,40,35,50,49,60,70,91,125]
    }],
    xaxis: {
      type: "numeric"
    },
    yaxis: [
        {
          title: {
            text: "Series A"
          },
        },
        {
          opposite: true,
          title: {
            text: "Series B"
          }
        }
    ]
}
var pieOptions = {
    series: [44, 55, 13, 33],
    chart: {
    width: 380,
    type: 'donut',
  },
  dataLabels: {
    enabled: false
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        show: false
      }
    }
  }],
  legend: {
    position: 'right',
    offsetY: 0,
    height: 230,
  }
  };
talentChart = new ApexCharts(document.getElementById('talentChart'), lineOptions);    talentChart.render();
trinketChart = new ApexCharts(document.getElementById('trinketChart'), lineOptions);    trinketChart.render();
legendaryChart = new ApexCharts(document.getElementById('legendaryChart'), lineOptions); legendaryChart.render();
covenantChart = new ApexCharts(document.getElementById('covenantChart'), pieOptions); covenantChart.render();

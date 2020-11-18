Chart.pluginService.register({
    beforeDraw: function(chart, easing) {
        if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
            var ctx = chart.chart.ctx;
            var chartArea = chart.chartArea;

            ctx.save();
            ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
            ctx.restore();
        }
    }
});

var urla = `https://coto-mobile.herokuapp.com/api/coil_resistance`;

var api = new XMLHttpRequest();
api.open('GET', urla, true);
api.send();

api.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
        var data = JSON.parse(this.responseText);

        var x = new Array(400).fill(0);
        var labelsArray = [];
        var colorArray = [];
        var colorTextArray = [];

        var limitA = 35;
        var limitB = 45;

        var total = [0];
        var mean;

        for (var i = limitA - 5; i <= limitB + 9; i += 0.5) {
            if (i >= limitA && i <= limitB) {
                colorArray.push('rgba(0, 0, 255, 1)');
            } else {
                colorArray.push('rgba(255, 0, 0, 1)');
            }
            labelsArray.push(`${i} - ${i+0.5}`);

            colorTextArray.push('rgba(0,0,0, 1)');
        }


        for (let i of data) {
            mean += Number(i.result1);

            x[Math.round((i.result1 + 100) / 0.5)]++;
        }


        mean /= data.length;
        document.getElementById('meanCR').innerHTML = `Mean: ${mean}`;

        for (let i = 0; i < x.length; i++) {
            x[i] *= 6;
        }


        var barChartData = {
            type: 'bar',
            data: {
                labels: labelsArray,
                datasets: [{
                    label: "Frequency",
                    backgroundColor: colorArray,
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 0.4,
                    data: x.slice((limitA) * 2, (limitB + 100) * 2)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 60,
                            fontColor: 'black'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Frequency',
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontColor: 'black'
                        },
                        categoryPercentage: 1.0,
                        barPercentage: 1.0,
                        scaleLabel: {
                            display: true,
                            labelString: 'Ohms',
                        }
                    }]
                },
                legend: {
                    display: false,
                    labels: {
                        fontColor: 'black'
                    }
                },
                chartArea: {
                    backgroundColor: 'white'
                },
                annotation: {
                    annotations: [{
                        type: 'line',
                        mode: 'vertical',
                        scaleID: 'y-axis-0',
                        value: -10,
                        borderColor: 'rgb(75, 192, 192)',
                        borderDash: [2, 2],
                        borderWidth: 2,
                        label: {
                            enabled: true,
                            position: "top",
                            yAdjust: 20,
                            content: 'Test limit'
                        }
                    }, {
                        type: 'line',
                        mode: 'vertical',
                        scaleID: 'y-axis-0',
                        value: 30,
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 2,
                        yPadding: 6,
                        borderDash: [2, 2],
                        label: {
                            enabled: true,
                            position: "top",
                            yAdjust: 20,
                            content: 'Test limit'
                        }
                    }]
                }
            },

        };

        var ctx = document.getElementById("CR").getContext("2d");

        var myChart = new Chart(ctx, barChartData);
    }
}
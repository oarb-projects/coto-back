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

var xRV = new Array(200).fill(0);
var labelsArrayRV = [];
var colorArrayRV = [];

var limitARV = 35;
var limitBRV = 45;

var viewLimitARV = limitARV - 6;
var viewLimitBRV = limitBRV + 9;

var meanRV;

api.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
        var data = JSON.parse(this.responseText);

        var max = 0;

        for (let i of data) {
            meanRV += i.result1;
            if (i.result1 > 0) {
                xRV[Math.round((i.result1 / 0.5))]++;
            }

            // console.log(typeof(i.result1));
            if (i.result1 > max) {
                max = i.result1;
            }
        }

        for (var i = 0; i <= max; i += 0.5) {
            if (i >= limitARV && i <= limitBRV) {
                colorArrayRV.push('rgba(0, 0, 255, 1)');
            } else {
                colorArrayRV.push('rgba(255, 0, 0, 1)');
            }
            labelsArrayRV.push(`${i} - ${i+0.5}`);
        }


        for (let i of data) {
            meanRV += Number(i.result1);

            xRV[Math.round((i.result1 + 100) / 0.5)]++;
        }


        meanRV /= data.length;
        document.getElementById('meanRV').innerHTML = `Mean: ${meanRV}`;

        var barChartData = {
            type: 'bar',
            data: {
                labels: labelsArrayRV.slice(viewLimitARV * 2, viewLimitBRV * 2),
                datasets: [{
                    label: "Frequency",
                    backgroundColor: colorArrayRV.slice(viewLimitARV * 2, viewLimitBRV * 2),
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 0.4,
                    data: xRV.slice(viewLimitARV * 2, viewLimitBRV * 2)
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
                        scaleID: 'x-axis-0',
                        value: labelsArrayRV[limitARV * 2],
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
                        scaleID: 'x-axis-0',
                        value: labelsArrayRV[limitBRV * 2],
                        borderColor: 'rgb(75, 192, 192)',
                        borderDash: [2, 2],
                        borderWidth: 2,
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

        var ctx = document.getElementById("RV").getContext("2d");

        var myChart = new Chart(ctx, barChartData);
    }
}

function displaceRV(step) {
    viewLimitARV += step;
    viewLimitBRV += step;

    var barChartData = {
        type: 'bar',
        data: {
            labels: labelsArrayRV.slice(viewLimitARV * 2, viewLimitBRV * 2),
            datasets: [{
                label: "Frequency",
                backgroundColor: colorArrayRV.slice(viewLimitARV * 2, viewLimitBRV * 2),
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 0.4,
                data: xRV.slice(viewLimitARV * 2, viewLimitBRV * 2)
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
                    scaleID: 'x-axis-0',
                    value: labelsArrayRV[limitARV * 2],
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
                    scaleID: 'x-axis-0',
                    value: labelsArrayRV[limitBRV * 2],
                    borderColor: 'rgb(75, 192, 192)',
                    borderDash: [2, 2],
                    borderWidth: 2,
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

    var ctx = document.getElementById("RV").getContext("2d");

    var myChart = new Chart(ctx, barChartData);
}
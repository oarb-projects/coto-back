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

var xSCR = new Array(200).fill(0);
var labelsArraySCR = [];
var colorArraySCR = [];

var limitASCR = 35;
var limitBSCR = 45;

var viewLimitASCR = limitASCR - 6;
var viewLimitBSCR = limitBSCR + 9;

var meanSCR;

api.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
        var data = JSON.parse(this.responseText);

        var max = 0;

        for (let i of data) {
            meanSCR += i.result1;
            if (i.result1 > 0) {
                xSCR[Math.round((i.result1 / 0.5))]++;
            }

            // console.log(typeof(i.result1));
            if (i.result1 > max) {
                max = i.result1;
            }
        }

        for (var i = 0; i <= max; i += 0.5) {
            if (i >= limitASCR && i <= limitBSCR) {
                colorArraySCR.push('rgba(0, 0, 255, 1)');
            } else {
                colorArraySCR.push('rgba(255, 0, 0, 1)');
            }
            labelsArraySCR.push(`${i} - ${i+0.5}`);
        }


        for (let i of data) {
            meanSCR += Number(i.result1);

            xSCR[Math.round((i.result1 + 100) / 0.5)]++;
        }


        meanSCR /= data.length;
        document.getElementById('meanSCR').innerHTML = `Mean: ${meanSCR}`;

        var barChartData = {
            type: 'bar',
            data: {
                labels: labelsArraySCR.slice(viewLimitASCR * 2, viewLimitBSCR * 2),
                datasets: [{
                    label: "Frequency",
                    backgroundColor: colorArraySCR.slice(viewLimitASCR * 2, viewLimitBSCR * 2),
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 0.4,
                    data: xSCR.slice(viewLimitASCR * 2, viewLimitBSCR * 2)
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
                        value: labelsArraySCR[limitASCR * 2],
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
                        value: labelsArraySCR[limitBSCR * 2],
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

        var ctx = document.getElementById("SCR").getContext("2d");

        var myChart = new Chart(ctx, barChartData);
    }
}

function displaceSCR(step) {
    viewLimitASCR += step;
    viewLimitBSCR += step;

    var barChartData = {
        type: 'bar',
        data: {
            labels: labelsArraySCR.slice(viewLimitASCR * 2, viewLimitBSCR * 2),
            datasets: [{
                label: "Frequency",
                backgroundColor: colorArraySCR.slice(viewLimitASCR * 2, viewLimitBSCR * 2),
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 0.4,
                data: xSCR.slice(viewLimitASCR * 2, viewLimitBSCR * 2)
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
                    value: labelsArraySCR[limitASCR * 2],
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
                    value: labelsArraySCR[limitBSCR * 2],
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

    var ctx = document.getElementById("SCR").getContext("2d");

    var myChart = new Chart(ctx, barChartData);
}
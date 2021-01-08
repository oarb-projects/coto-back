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

for (let actual of parameters) {
    var api = new XMLHttpRequest();
    api.open('GET', actual.urla, true);
    api.send();

    actual.x = new Array((Math.round(actual.max - actual.min) / actual.width)).fill(0);
    actual.labelsArray = [];
    actual.colorArray = [];


    actual.viewLimitA = actual.limitA - (10 * actual.width);
    actual.viewLimitB = actual.limitB + (10 * actual.width);

    actual.viewLimitA = actual.viewLimitA < 0 ? 0 : actual.viewLimitA;
    actual.viewLimitB = actual.viewLimitB > actual.max ? actual.max : actual.viewLimitB;

    actual.mean = 0;

    api.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);

            for (let i of data) {
                actual.mean += i.result1;

                //Array of frequency
                if (i.result1 > 0) {
                    actual.x[Math.floor((i.result1 / actual.width))]++;
                }
            }
            actual.mean /= data.length;


            //Limit axis Y
            actual.maxViewY = 0;

            for (let i = actual.min; i <= actual.max; i = ((parseFloat(i) + actual.width).toFixed(2))) {
                if (i >= actual.limitA && i <= actual.limitB) {
                    actual.colorArray.push('rgba(0, 0, 255, 1)');
                } else {
                    actual.colorArray.push('rgba(255, 0, 0, 1)');
                }
                actual.labelsArray.push(`${i} - ${(parseFloat(i) + actual.width).toFixed(2)}`);

                if (actual.x[Math.round((parseFloat(i) + actual.width) / actual.width)] > actual.maxViewY) {
                    actual.maxViewY = actual.x[Math.round((parseFloat(i) + actual.width) / actual.width)];
                }
            }
            actual.maxViewY = Math.ceil((actual.maxViewY + 10) / 10) * 10;

            document.getElementById(`mean${actual.id}`).innerHTML = `Mean: ${actual.mean.toFixed(2)}`;

            var barChartData = {
                type: 'bar',
                data: {
                    labels: actual.labelsArray.slice(actual.viewLimitA / actual.width, actual.viewLimitB / actual.width),
                    datasets: [{
                        label: "Frequency",
                        backgroundColor: actual.colorArray.slice(actual.viewLimitA / actual.width, actual.viewLimitB / actual.width),
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 0.4,
                        data: actual.x.slice(actual.viewLimitA / actual.width, actual.viewLimitB / actual.width)
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
                                max: actual.maxViewY,
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
                                labelString: actual.scaleUnits,
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
                            value: actual.labelsArray[Math.round((actual.limitA - actual.min) / actual.width)],
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
                            value: actual.labelsArray[Math.floor((actual.limitB - actual.min) / actual.width)],
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

            document.getElementById(`${actual.id}-main-container`).className  = "d-block";

            var ctx = document.getElementById(actual.id).getContext("2d");
            var myChart = new Chart(ctx, barChartData);

            document.getElementById(`${actual.id}-main-container`).className  = "disapear-md";
        }
    }

    document.getElementById(`left${actual.id}`).addEventListener("click", function() {
        displace(-(actual.width), actual);
    });
    document.getElementById(`right${actual.id}`).addEventListener("click", function() {
        displace((actual.width), actual);
    });

    $('select').append(`<option value="${actual.id}">${actual.name}</option>`);
}


function displace(step, actual) {
    if (actual.viewLimitA + step >= 0 && actual.viewLimitB + step <= actual.max) {
        actual.viewLimitA += step;
        actual.viewLimitB += step;

        actual.viewLimitA = actual.viewLimitA < 0 ? 0 : actual.viewLimitA;
        actual.viewLimitB = actual.viewLimitB > actual.max ? actual.max : actual.viewLimitB;

        var scroll = document.documentElement.scrollTop;
        $(`#${actual.id}`).remove();
        $(`#${actual.id}sub-container`).append(`<canvas id="${actual.id}" height="472" width="615" class="chartjs-render-monitor" style="display: block; height: 350px; width: 456px;"></canvas>`);

        var barChartData = {
            type: 'bar',
            data: {
                labels: actual.labelsArray.slice(actual.viewLimitA / actual.width, actual.viewLimitB / actual.width),
                datasets: [{
                    label: "Frequency",
                    backgroundColor: actual.colorArray.slice(actual.viewLimitA / actual.width, actual.viewLimitB / actual.width),
                    borderColor: 'rgba(0,0,0,1)',
                    borderWidth: 0.4,
                    data: actual.x.slice(actual.viewLimitA / actual.width, actual.viewLimitB / actual.width)
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
                            max: actual.maxViewY,
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
                            labelString: actual.scaleUnits,
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
                        value: actual.labelsArray[Math.round((actual.limitA - actual.min) / actual.width)],
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
                        value: actual.labelsArray[Math.floor((actual.limitB - actual.min) / actual.width)],
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

        var ctx = document.getElementById(actual.id).getContext("2d");
        var myChart = new Chart(ctx, barChartData);

        document.documentElement.scrollTop = scroll;
    }
}
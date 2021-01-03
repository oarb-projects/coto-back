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

document.addEventListener("DOMContentLoaded", function () {
    let noSelector = document.querySelector('#test-no-selecter');
    let mobilSelector = document.querySelector('#select');
    mobilSelector.addEventListener('change', changeVisibility);
    noSelector.addEventListener('change', updatePageData);
    updatePageData();

    //TODO: Confirm that limitA and limitB are given values
    function updatePageData(){
        let actualArray = data.get(parseInt(noSelector.value));
    
        for (let actual of actualArray) {
            actual.mean = actual.measures[0]["AVG(result1)"];

            actual.min = Math.round(Math.floor(actual.measures[0]["MIN(result1)"] / actual.width) * actual.width);
            actual.max = Math.round(Math.ceil(actual.measures[0]["MAX(result1)"] / actual.width) * actual.width);
            actual.min = actual.min > actual.limitA? actual.limitA - 10 * actual.width : actual.min;
            actual.max = actual.max < actual.limitB? actual.limitB + 10 * actual.width : actual.max;

            actual.x = new Array(Math.round((actual.max - actual.min) / actual.width)).fill(0);
            actual.labelsArray = [];
            actual.colorArray = [];

            actual.limitA = Math.round(actual.limitA / actual.width) * actual.width;
            actual.limitB = Math.round(actual.limitB / actual.width) * actual.width;

            actual.viewLimitA = Math.round((actual.limitA - actual.min) / actual.width) - 10;
            actual.viewLimitB = Math.round((actual.limitB - actual.min) / actual.width) + 10;
            actual.viewLimitA = actual.viewLimitA < 0 ? 0 : actual.viewLimitA;
            actual.viewLimitB = actual.viewLimitB > actual.x.length ? actual.x.length : actual.viewLimitB;

            for (let i of actual.data) {
                actual.x[Math.floor((i.result1 - actual.min) / actual.width)]++;
            }

            //Limit axis Y
            actual.maxViewY = 0;
            for (let i = actual.min; i < actual.max; i = (parseFloat(i) + actual.width).toFixed(3)) {
                let color = (i >= actual.limitA && i <= actual.limitB)? 'rgba(0, 0, 255, 1)' : 'rgba(255, 0, 0, 1)';
                actual.colorArray.push(color);

                actual.labelsArray.push(`${i} - ${(parseFloat(i) + actual.width - 0.01).toFixed(2)}`);

                let actualItem = actual.x[Math.round((parseFloat(i) + actual.width) / actual.width)];
                actual.maxViewY = actualItem > actual.maxViewY? actualItem : actual.maxViewY;
            }
            actual.maxViewY = Math.ceil((actual.maxViewY + 10) / 10) * 10;

            let scroll = document.documentElement.scrollTop;
            let oldChart = document.getElementById(actual.id);
            let newChart = `<canvas id="${actual.id}" height="472" width="615" class="chartjs-render-monitor" style="display: block; height: 350px; width: 456px;"></canvas>`;
            let container = oldChart.parentElement;
            container.removeChild(oldChart);
            container.innerHTML = newChart;

            var barChartData = {
                type: 'bar',
                data: {
                    labels: actual.labelsArray.slice(actual.viewLimitA, actual.viewLimitB),
                    datasets: [{
                        label: "Frequency",
                        backgroundColor: actual.colorArray.slice(actual.viewLimitA, actual.viewLimitB),
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 0.4,
                        data: actual.x.slice(actual.viewLimitA, actual.viewLimitB),
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
            let ctx = document.getElementById(actual.id).getContext("2d");        
            let myChart = new Chart(ctx, barChartData);

            let leftButton = document.getElementById(`left${actual.id}`);
            let rightButton = document.getElementById(`right${actual.id}`);
            let meanDiv = document.getElementById(`mean${actual.id}`);

            meanDiv.innerHTML = actual.mean == null? `Mean: null` : `Mean: ${actual.mean.toFixed(2)}`;
            document.documentElement.scrollTop = scroll;
            leftButton.addEventListener("click", function() {
                displace(-1, actual);
            });
            rightButton.addEventListener("click", function() {
                displace(1, actual);
            });

            changeVisibility();
        }
    }
    function displace(step, actual) {
        if (actual.viewLimitA + step >=  0 && actual.viewLimitB + step <= actual.x.length) {
            actual.viewLimitA += step;
            actual.viewLimitB += step;
            actual.viewLimitA = actual.viewLimitA < 0 ? 0 : actual.viewLimitA;
            actual.viewLimitB = actual.viewLimitB > actual.x.length ? actual.x.length : actual.viewLimitB;

            let scroll = document.documentElement.scrollTop;
            let oldChart = document.getElementById(actual.id);
            let newChart = `<canvas id="${actual.id}" height="472" width="615" class="chartjs-render-monitor" style="display: block; height: 350px; width: 456px;"></canvas>`;
            let container = oldChart.parentElement;
            container.removeChild(oldChart);
            container.innerHTML = newChart;
    
            var barChartData = {
                type: 'bar',
                data: {
                    labels: actual.labelsArray.slice(actual.viewLimitA, actual.viewLimitB),
                    datasets: [{
                        label: "Frequency",
                        backgroundColor: actual.colorArray.slice(actual.viewLimitA, actual.viewLimitB),
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 0.4,
                        data: actual.x.slice(actual.viewLimitA, actual.viewLimitB),
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
    
            let ctx = document.getElementById(actual.id).getContext("2d");
            let myChart = new Chart(ctx, barChartData);
    
            document.documentElement.scrollTop = scroll;
        }
    }
    function changeVisibility() {
        for (let i of data.values().next().value) {
            var element = document.getElementById(`${i.id}-main-container`);
            if (mobilSelector.value == i.id) {
                element.className = "d-unset";
            } else {
                element.className = "disapear-md";
            }
        }
    }
});
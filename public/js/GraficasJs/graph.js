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
    let params = new URLSearchParams(window.location.search);
    let noSelector = document.querySelector('#test-no-selecter');
    noSelector.addEventListener('change', updatePageData);
    updatePageData();

    if(params.get('pdf') == 'true'){
        let content = document.querySelector('.second-container');

        content.style = "background-color:white; margin: 0; width: 100%";
        $('.zoom-buttons').hide();
        $('.btn-danger').hide();
        $('#send').hide();
    }

    function updatePageData(){
        let actualArray = data.get(parseInt(noSelector.value));
        
        for (let actual of actualArray) {
            if(!actual.mean){
                actual.mean = actual.measures[0]["AVG(result1)"];
                let limA = params.get(`${actual.id}_${noSelector.value}_Alim`);
                let limB = params.get(`${actual.id}_${noSelector.value}_Blim`);

                actual.viewLimitA = limA || actual.viewLimitA;
                actual.viewLimitB = limB || actual.viewLimitB;

                generateArray(actual);
            }
            drawChart(actual);

            //Zoom
            $(`#${actual.id}-percentage`).text(`${Math.round(actual.zoom * 100)}%`);

            //Mean
            let meanDiv = document.getElementById(`mean${actual.id}`);
            meanDiv.innerHTML = actual.mean == null? `Mean: null` : `Mean: ${actual.mean.toFixed(2)}`;

            // Buttons
            let leftButton = $(`#left${actual.id}`);
            let rightButton = $(`#right${actual.id}`);
            let plusButton = $(`#${actual.id}-plus`);
            let minusButton = $(`#${actual.id}-minus`);

            leftButton.off('click').on('click', function() {
                displace(-1, actual);
            });
            rightButton.off('click').on('click', function() {
                displace(1, actual);
            });
            plusButton.off('click').on('click', function() {
                applyZoom("+", actual);
            });
            minusButton.off('click').on('click', function() {
                applyZoom("-", actual);
            });
        }
    }
    function generateArray(actual){
        actual.min = Math.round(Math.floor(actual.measures[0]["MIN(result1)"] / actual.width) * actual.width);
        actual.max = Math.round(Math.ceil(actual.measures[0]["MAX(result1)"] / actual.width) * actual.width);
        actual.min = actual.min > actual.limitA? actual.limitA - 10 * actual.width : actual.min;
        actual.max = actual.max < actual.limitB? actual.limitB + 10 * actual.width : actual.max;

        actual.x = new Array(Math.round((actual.max - actual.min) / actual.width)).fill(0);
        actual.labelsArray = [];
        actual.colorArray = [];
        actual.maxViewY = 0;
        actual.zoom = 1;

        //Filling Arrays
        for (let i of actual.data) {
            actual.x[Math.floor((i.result1 - actual.min) / actual.width)]++;
        }
        
        for (let i = actual.min; i < actual.max; i = (parseFloat(i) + actual.width).toFixed(3)) {
            let color = (i >= actual.limitA && i <= actual.limitB)? 'rgba(0, 0, 255, 1)' : 'rgba(255, 0, 0, 1)';
            actual.colorArray.push(color);

            actual.labelsArray.push(i);

            let actualItem = actual.x[Math.round((parseFloat(i) + actual.width) / actual.width)];
            actual.maxViewY = actualItem > actual.maxViewY? actualItem : actual.maxViewY;
        }
        actual.maxViewY = Math.ceil((actual.maxViewY + 10) / 10) * 10;

        //Array limits
        actual.limitA = Math.round(actual.limitA / actual.width) * actual.width;
        actual.limitB = Math.round(actual.limitB / actual.width) * actual.width;

        actual.viewLimitA = actual.viewLimitA || Math.round((actual.limitA - actual.min) / actual.width) - 10;
        actual.viewLimitB = actual.viewLimitB || Math.round((actual.limitB - actual.min) / actual.width) + 10;

        actual.viewLimitA = actual.viewLimitA < 0 ? 0 : actual.viewLimitA;
        actual.viewLimitB = actual.viewLimitB > actual.x.length ? actual.x.length : actual.viewLimitB;
        actual.viewWidth = Math.round(actual.viewLimitB - actual.viewLimitA);
        actual.lengthDif = 0;
    }
    function applyZoom(zoom, actual){
        switch(zoom){
            case '-':
                actual.zoom -= 0.10;
                break;

            case '+':
                actual.zoom += 0.10;
                break;
        }

        actual.zoom = actual.zoom > 2? 2 : actual.zoom;
        actual.zoom = actual.zoom < 0.1? 0.1 : actual.zoom;

        actual.lastLengthDif = actual.lengthDif;
        actual.lengthDif = (actual.viewWidth / (actual.zoom) - actual.viewWidth) / 2;
        actual.viewLimitA = Math.round(actual.viewLimitA - (actual.lengthDif - actual.lastLengthDif));
        actual.viewLimitB = Math.round(actual.viewLimitB + (actual.lengthDif - actual.lastLengthDif));

        if(actual.viewLimitA < 0 || actual.viewLimitB > actual.x.length){
            switch(zoom){
                case '-':
                    applyZoom('+', actual);
                    break;
    
                case '+':
                    applyZoom('-', actual);
                    break;
            }
        }

        $(`#${actual.id}-percentage`).text(`${Math.round(actual.zoom * 100)}%`);

        drawChart(actual);
    }
    function displace(step, actual) {
        if (actual.viewLimitA + step >=  0 && actual.viewLimitB + step <= actual.x.length) {
            actual.viewLimitA += step;
            actual.viewLimitB += step;
            actual.viewLimitA = actual.viewLimitA < 0 ? 0 : actual.viewLimitA;
            actual.viewLimitB = actual.viewLimitB > actual.x.length ? actual.x.length : actual.viewLimitB;

            drawChart(actual);
        }
    }
    function drawChart(actual){
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
                            max: Math.round(actual.maxViewY / actual.zoom),
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

        document.getElementById(`${actual.id}-main-container`).style.display  = "block";
        let ctx = document.getElementById(actual.id).getContext("2d");
        new Chart(ctx, barChartData);
        document.getElementById(`${actual.id}-main-container`).style.display  = "";
        document.documentElement.scrollTop = scroll;
    }

    // Settings view
    $('#setting-btn').on('click', () => {
        $('#chart-configuration').css( "display", "flex" );
    });
    $('#close-settings').on('click', ()=>{
        $('#chart-configuration').css( "display", "none" );
    });
    $("#btnLeft-setting").click(function () {
        var selectedItem = $("#selected_tests option:selected");
        $("#non_selected_tests").append(selectedItem);
    });
    $("#btnRight-setting").click(function () {
        var selectedItem = $("#non_selected_tests option:selected");
        $("#selected_tests").append(selectedItem);
    });
    $('#apply-settings').on("click", function (e) {
        e.preventDefault();
        
        for(let i of $('#selected_tests option')){
            $(`#${i.value}-main-container`).show();
        }
        for(let i of $('#non_selected_tests option')){
            $(`#${i.value}-main-container`).hide();
        }
    });
});
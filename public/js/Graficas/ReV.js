var urla = `https://coto-mobile.herokuapp.com/api/release_voltage`;

var api = new XMLHttpRequest();
api.open('GET', urla, true);
api.send();

api.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        var x = [0];
        var y = [0];
        var z = [0];
        var total = [0];
        var legend, n, t;

        for (var item of data) {
            total.push(item.result1);
            if (item.result1 >= 1.2 && item.result1 <= 3.8)
                x.push(item.result1);
            else
                z.push(item.result1);
        }

        //promedio
        var mean = 0;
        for (var i = 0; i < total.length; i++) {
            mean += total[i];
        }
        mean /= total.length;
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (w < 470) {
            n = 6
            t = 0;
            legend = false;
        } else {
            n = 0;
            t = 3;
            legend = true;
        }

        $(window).resize(function() {
            w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (w < 470) {
                n = 6
                t = 0;
                legend = false;
            } else {
                n = 0;
                t = 3;
                legend = true;
            }
            //console.log(w,legend);
        });

        //console.log(mean);
        var trace1 = {
            x: x,
            name: "Mean: " + mean.toFixed(2),
            type: 'histogram',
            showlegend: legend,
            //legendgroup: "Gg",
            opacity: 1,
            text: "Frecuency",
            hoverinfo: "x+y",
            histfunc: "count",
            histnorm: "",
            xbins: {
                size: .1
            },
            marker: {
                line: {
                    width: 1,
                    color: "black"
                },
                color: "blue",
                hoverlabel: {
                    bgcolor: "blue"
                        //font:{
                        //family,size,color
                        //}
                },
            },
        }
        var sigma = {
            x: y,
            name: "Sgma: ",
            type: 'histogram',
            showlegend: legend,
        }

        var vc = {
            x: y,
            name: "VcPK: ",
            type: 'histogram',
            showlegend: legend,
        }

        var lc = {
            x: z,
            name: "LcPK: ",
            type: 'histogram',
            showlegend: legend,
            //legendgroup: "Gg",
            opacity: 1,
            text: "Frecuency",
            hoverinfo: "x+y",
            histfunc: "count",
            histnorm: "",
            //nbinsx: x.length,
            //autobin: x.length
            xbins: {
                size: .1
            },
            marker: {
                line: {
                    width: 1,
                    color: "black"
                },
                color: "red",
                hoverlabel: {
                    bgcolor: "red"
                        //font:{
                        //family,size,color
                        //}
                },
            },
        }

        var data = [trace1, sigma, vc, lc];
        var layout = {
            title: "Release Voltage",
            //showlegend: false
            dragmode: "pan",
            xaxis: {
                title: "Volts",
                autorange: false,
                range: [0, 5],
                zeroline: false
            },
            yaxis: {
                title: "Frecuency",
                autorange: true
            },
            barmode: "overlay",
            //annotations[]
            //barmode: "overlay"
            //bargap: 0
            shapes: [{
                    type: 'line',
                    x0: 1.2,
                    y0: 0,
                    x1: 1.2,
                    y1: 55,
                    line: {
                        color: "red",
                        width: 3,
                        dash: 'dot'
                    }
                },
                {
                    type: 'line',
                    x0: 3.8,
                    y0: 0,
                    x1: 3.8,
                    y1: 55 + n,
                    line: {
                        color: "red",
                        width: 3,
                        dash: 'dot'
                    }
                }
            ],
            annotations: [{
                    x: 1.2,
                    y: 55,
                    xref: 'x',
                    yref: 'y',
                    text: 'Test Limit',
                    showarrow: true,
                    arrowhead: 7,
                    ax: 0,
                },
                {
                    x: 3.8,
                    y: 55 + n,
                    xref: 'x',
                    yref: 'y',
                    text: 'Test Limit',
                    showarrow: true,
                    arrowhead: 7,
                    ax: 0,
                },
                {
                    x: mean,
                    y: 55 + (n / 2) + t,
                    xref: 'x',
                    yref: 'y',
                    text: 'Mean',
                    showarrow: true,
                    arrowhead: 7,
                    ax: 0,
                }
            ]
        };

        if (w > 768) {
            layout.paper_bgcolor = '#929292';
        } else {
            layout.paper_bgcolor = '#ffffff';
        }


        $(window).resize(function() {
            layout.showlegend = legend;
            console.log(layout.showlegend);
            if (w > 768) {
                layout.paper_bgcolor = '#929292';
            } else {
                layout.paper_bgcolor = '#ffffff';
            }
        });

        Plotly.newPlot('RV', data, layout, { responsive: true });
        $(window).resize(function() {
            Plotly.newPlot('CR', data, layout, { responsive: true });
        });
    }
}

function getScript(url, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    document.getElementsByTagName('head')[0].appendChild(script);
}

function retrieveData(callback) {

    var urla = `https://coto-mobile.herokuapp.com/api/release_voltage`;

    var api = new XMLHttpRequest();
    api.open('GET', urla, true);
    api.send();

    api.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(this.responseText);
            var data = JSON.parse(this.responseText);
            var results = {
                mean: null,
                sigma: null,
                VcPK: null,
                LcPK: null
            };
            var total = [0];
            var item;

            for (var item of data) {
                total.push(item.result1);
            }

            //promedio
            for (var i = 0; i < total.length; i++) {
                results.mean += total[i];
            }
            results.mean /= total.length;
            callback(results);
        }
    }
}
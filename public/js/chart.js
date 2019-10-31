var d3 = Plotly.d3;
var img_jpg = d3.select('#jpg-export');
  var x = [];
  for(var i = 0 ; i < 1000; i++){
    x.push((Math.random()*(48-34))+34);
  }
  //promedio
  var mean = 0;
  for (var i = 0; i < x.length; i++) {
    mean += x[i];
  }
  mean /= x.length;

  //console.log(mean);
  var trace1 = {
    x:x,
    name: "Mean: " + mean.toFixed(2),
    type:'histogram',
    showlegend: true,
    //legendgroup: "Gg",
    opacity: 1,
    text: "Frecuency",
    hoverinfo: "x+y",
    histfunc:"count",
    histnorm: "",
    //nbinsx: x.length,
    //autobin: x.length
    xbins: {
      size: .5
    },
    marker:{
      line:{
        width: 1,
        color: 	"black"
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
  var data = [trace1];
  var layout = {
    title: "Coil Resistance",
    //showlegend: false
    dragmode: "pan",
    xaxis:{
      title: "QUANTITY",
      autorange: false,
      range: [30,56],
      zeroline:false
    },
    yaxis:{
      title: "Frecuency",
      autorange: true
    },
    //barmode:"overlay"
    //annotations[]
    //barmode: "overlay"
    //bargap: 0
    shapes:[
        {
          type:'line',
          x0: 36,
          y0: 0,
          x1: 36,
          y1: 55,
          line:{
            color: "red",
            width: 3,
            dash: 'dot'
          }
        },
      {
        type:'line',
        x0: 44,
        y0: 0,
        x1: 44,
        y1: 55,
        line:{
          color: "red",
          width: 3,
          dash: 'dot'
        }
      }
    ],
    annotations: [
      {
        x: 36,
        y: 55,
        xref: 'x',
        yref: 'y',
        text: 'Test Limit',
        showarrow: true,
        arrowhead: 7,
        ax: 0,
      },
      {
        x: 44,
        y: 55,
        xref: 'x',
        yref: 'y',
        text: 'Test Limit',
        showarrow: true,
        arrowhead: 7,
        ax: 0,
      },
      {
        x: mean,
        y: 55,
        xref: 'x',
        yref: 'y',
        text: 'Mean',
        showarrow: true,
        arrowhead: 7,
        ax: 0,
      }
    ]
  };
  Plotly.newPlot('CR',data,layout).then(
    function(gd)
     {
      Plotly.toImage(gd,{height:300,width:300})
         .then(
             function(url)
         {
             img_jpg.attr("src", url);
             return Plotly.toImage(gd,{format:'jpeg',height:400,width:400});
         }
         )
    });

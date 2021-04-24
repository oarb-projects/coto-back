window.onload = function (event) {
  const socket = io();
  var pdf = true;

  //DOM elements
  var windowBtn = document.querySelector("#send");
  var generateBtn = document.querySelector("#generate-pdf");

  //Selector
  windowBtn.addEventListener("click", function () {
    $('#pdf-selection').css( "display", "flex" );
  });

  $('#close-download').on('click', ()=>{
    $('#pdf-selection').css( "display", "none" );
  });
  $("#btnLeft").click(function () {
    var selectedItem = $("#selected_part_num option:selected");
    $("#non_selected_part_num").append(selectedItem);
  });

  $("#btnRight").click(function () {
      var selectedItem = $("#non_selected_part_num option:selected");
      $("#selected_part_num").append(selectedItem);
  });

  //Send Data
  generateBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    let part_num = [];
    let tests = [];
    let visualizationQuery = '';

    for(let i of $('#selected_part_num option')){
      part_num.push(i.value);
    }
    for(let i of $('#selected_tests option')){
      tests.push(i.value);
    }

    data.forEach((value, key, map) => {
      for(let test of value){
        visualizationQuery += `${test.id}_${key}_Alim=${test.viewLimitA}&`;
        visualizationQuery += `${test.id}_${key}_Blim=${test.viewLimitB}&`;
      }
    });

    let pareto = document.getElementById('option-pareto').checked;
    let summary = document.getElementById('option-summary').checked;
    let charts = tests.length > 0? document.getElementById('option-charts').checked : false;

    if(part_num.length > 0 && (pareto || summary || charts)){
      let data = {
        part_num,
        tests,
        visualizationQuery,
        pages : {
          pareto, 
          summary,
          charts
        }
      }

      swal({
        title: "Loading...",
        showConfirmButton: false,
      });
      document.querySelector('.sweet-alert').style.top = '45%';
      document.querySelector(".sa-custom").style = "width: 4rem; height: 4rem;";
      document.querySelector(".sa-custom").className = "spinner-border text-primary d-inline-flex my-3";
      $('#pdf-selection').css( "display", "none" );
      socket.emit("generate-pdf", data);
    }
  });

  socket.on("image", function (info) {
    console.log(info);
    if (info.image) {
      var img = new Image();
      img.src = "data:image/png;base64," + b64(info.buffer);
      // ctx.drawImage(img, 0, 0);
      document.querySelector(".main-container").appendChild(img);
    }
  });
  function b64(e) {
    var t = "";
    var n = new Uint8Array(e);
    var r = n.byteLength;
    for (var i = 0; i < r; i++) {
      t += String.fromCharCode(n[i]);
    }
    return window.btoa(t);
  }

  socket.on("pdf", function (info) {
    swal("Done!", "", "success");
    document.querySelector('.sweet-alert').style.top = '55%';
    document.querySelector(".spinner-border").className = "sa-icon sa-custom d-none";

    console.log(info);
    let pdfBlob = new Blob([info.buffer], { type: "application/pdf" });
    let url = webkitURL.createObjectURL(pdfBlob);
    window.open(url);
  });

  socket.on("error", function (info) {
    swal("Error!", "", "error");
    document.querySelector('.sweet-alert').style.top = '55%';
    document.querySelector(".spinner-border").className = "sa-icon sa-custom d-none";
  });
};

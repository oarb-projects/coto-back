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

  $('.fa-window-close').on('click', ()=>{
    $('#pdf-selection').css( "display", "none" );
  });
  $("#btnLeft").click(function () {
    var selectedItem = $("#rightValues option:selected");
    $("#leftValues").append(selectedItem);
  });

  $("#btnRight").click(function () {
      var selectedItem = $("#leftValues option:selected");
      $("#rightValues").append(selectedItem);
  });

  //Send Data
  generateBtn.addEventListener("click", function (e) {
    e.preventDefault();
    
    var data = [];
    for(let i of $('#rightValues option')){
      data.push(i.value);
    }

    if(data.length > 0){
      swal({
        title: "Loading...",
        showConfirmButton: false,
      });
      document.querySelector('.sweet-alert').style.top = '45%';
      document.querySelector(".sa-custom").style = "width: 4rem; height: 4rem;";
      document.querySelector(".sa-custom").className = "spinner-border text-primary d-inline-flex my-3";
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

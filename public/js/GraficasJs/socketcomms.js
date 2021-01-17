window.onload = function (event) {
  const socket = io();
  var pdf = true;

  //DOM elements
  var btn = document.querySelector("#send");

  function b64(e) {
    var t = "";
    var n = new Uint8Array(e);
    var r = n.byteLength;
    for (var i = 0; i < r; i++) {
      t += String.fromCharCode(n[i]);
    }
    return window.btoa(t);
  }

  btn.addEventListener("click", function () {
    swal({
      title: "Loading...",
      showConfirmButton: false,
    });
    document.querySelector('.sweet-alert').style.top = '45%';
    document.querySelector(".sa-custom").style = "width: 4rem; height: 4rem;";
    document.querySelector(".sa-custom").className = "spinner-border text-primary d-inline-flex my-3";

    socket.emit("generate-pdf", window.location.search);
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

  socket.on("pdf", function (info) {
    swal("Done!", "", "success");
    document.querySelector('.sweet-alert').style.top = '55%';
    document.querySelector(".spinner-border").className = "sa-icon sa-custom d-none";

    console.log(info);
    let pdfBlob = new Blob([info.buffer], { type: "application/pdf" });
    let url = webkitURL.createObjectURL(pdfBlob);
    window.open(url);
  });
};

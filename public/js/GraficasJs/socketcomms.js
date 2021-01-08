
window.onload = function(event) {
    function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}

    const socket = io ();
    var pdf = true;
    //DOM elements
    var btn = document.querySelector('#send');

    btn.addEventListener('click', function(){
        console.log('click')
        // document.querySelector(".second-container").style="background-color:white"
        socket.emit('generate-pdf', pdf)
    });

    // var ctx = document.getElementById('finalCanvas').getContext('2d');

    socket.on("image", function(info) {
        console.log(info)
        if (info.image) {
            var img = new Image();
            img.src = 'data:image/png;base64,' + b64(info.buffer);
            // ctx.drawImage(img, 0, 0);
            document.querySelector(".main-container").appendChild(img)
        }
    });

    socket.on("pdf", function(info) {
        console.log(info)
        pdfBlob = new Blob([info.buffer],{type:"application/pdf"});
        url = webkitURL.createObjectURL(pdfBlob);
        window.open(url);
    });
};

document.addEventListener("DOMContentLoaded", function () {
  let json = {
    Rtested: 174,
    Rpassed: 172,
    Rfailed: 2,
    Yield: 98.85,
    Tquantity: 175,
    Rquantity: 3,
    FinalYield: 98.29,
    Iquantity: 200,
    IYield: 86,
    ElapsedTime: 5627,
    Ttime: 1906,
    Arate: 111,
    Atrate: 329,
    Rejects: 1,
    Idletime: 3721,

    PN: "5000 - 0124",
    APPL: "FINAL",
    REV: 7,
    PLT: "1916 - 110",
    LOT: "1 / 15 / 19",
    DC: 1916,
    FILENAME: "D590733",
    TD: "08 / 27 / 19",
    ST: "10:33:23",
  };

  var elapsedtime = json.ElapsedTime;
  var ethours = Math.floor(elapsedtime / 3600);
  var etmins = Math.floor(elapsedtime / 60) - ethours * 60;
  var etsecs = elapsedtime - ethours * 3600 - etmins * 60;

  var ttime = json.Ttime;
  var tthours = Math.floor(ttime / 3600);
  var ttmins = Math.floor(ttime / 60) - tthours * 60;
  var ttsecs = ttime - tthours * 3600 - ttmins * 60;

  var itime = json.Idletime;
  var ihours = Math.floor(itime / 3600);
  var imins = Math.floor(itime / 60) - ihours * 60;
  var isecs = itime - ihours * 3600 - imins * 60;

  var rtested = document.getElementById("v1");
  rtested.innerHTML = json.Rtested;

  var rpassed = document.getElementById("v2");
  rpassed.innerHTML = json.Rpassed;

  var rfailed = document.getElementById("v3");
  rfailed.innerHTML = json.Rfailed;

  var yield = document.getElementById("v4");
  yield.innerHTML = json.Yield + "%";

  var rejects = document.getElementById("v14");
  rejects.innerHTML = json.Rejects;

  var tquantity = document.getElementById("v5");
  tquantity.innerHTML = json.Tquantity;

  var rquantity = document.getElementById("v6");
  rquantity.innerHTML = json.Rquantity;

  var fyield = document.getElementById("v7");
  fyield.innerHTML = json.FinalYield + "%";

  var iquantity = document.getElementById("v8");
  iquantity.innerHTML = json.Iquantity;

  var iyield = document.getElementById("v9");
  iyield.innerHTML = json.IYield;

  var etime = document.getElementById("v10");
  etime.innerHTML = ethours + " hrs " + etmins + " mins " + etsecs + " secs";

  var idtime = document.getElementById("v15");
  idtime.innerHTML = ihours + " hrs " + imins + " mins " + isecs + " secs";

  var rtested = document.getElementById("v11");
  rtested.innerHTML = tthours + " hrs " + ttmins + " mins " + ttsecs + " secs";

  var arate = document.getElementById("v12");
  arate.innerHTML = json.Arate;

  var atrate = document.getElementById("v13");
  atrate.innerHTML = json.Atrate;

  //datos header
  var valpn = document.getElementById("hd1");
  valpn.innerHTML = json.PN;

  var valapp = document.getElementById("hd2");
  valapp.innerHTML = json.APPL;

  var rrev = document.getElementById("hd3");
  rrev.innerHTML = json.REV;

  var valplt = document.getElementById("hd4");
  valplt.innerHTML = json.PLT;

  var vallot = document.getElementById("hd5");
  vallot.innerHTML = json.LOT;

  var valdc = document.getElementById("hd6");
  valdc.innerHTML = json.DC;

  var valfn = document.getElementById("hd7");
  valfn.innerHTML = json.FILENAME;

  var valtd = document.getElementById("hd8");
  valtd.innerHTML = json.TD;

  var valst = document.getElementById("hd9");
  valst.innerHTML = json.ST;

  function dots() {
    var x = "";
    return x;
  }

  let params = new URLSearchParams(window.location.search);
  if (params.get("pdf") == "true") {
    let title = document.createElement('h1');
    let text = document.createTextNode('Test Info');
    title.appendChild(text);
    title.style.textAlign = 'center';

    let content = document.getElementById('testDiv');
    content.style.width = '100%';

    document.body.innerHTML = '';
    document.body.appendChild(title);
    document.body.appendChild(content);
  }
});

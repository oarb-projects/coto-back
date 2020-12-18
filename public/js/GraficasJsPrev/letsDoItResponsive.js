function changeVisibility() {
    var actual = document.getElementById("select").value;

    for (let i of new Array("OV", "RT", "OT", "SCR", "RV", "CR")) {
        if (actual == i) {
            document.getElementById(`${i}-main-container`).style.display = "unset";
            document.getElementById(`${i}`).style.display = "unset";
            document.getElementById(`${i}sub-container`).style.height = "44vh";
        } else {
            document.getElementById(`${i}-main-container`).style.display = "none";
        }
    }
}
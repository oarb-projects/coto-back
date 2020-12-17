function changeVisibility() {
    var actual = document.getElementById("select").value;

    for (let i of parameters) {
        if (actual == i.id) {
            document.getElementById(`${i.id}-main-container`).style.display = "unset";
            document.getElementById(`${i.id}`).style.display = "unset";
            document.getElementById(`${i.id}sub-container`).style.height = "44vh";
        } else {
            document.getElementById(`${i.id}-main-container`).style.display = "none";
        }
    }
}
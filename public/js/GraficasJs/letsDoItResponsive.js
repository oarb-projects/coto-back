

function changeVisibility() {
    var actual = document.getElementById("select").value;

    for (let i of parameters) {
        var element = document.getElementById(`${i.id}-main-container`);
        if (actual == i.id) {
            element.className  = 'd-unset';
        } else {
            element.className  = "disapear-md";
        }
    }
}
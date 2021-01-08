document.addEventListener("DOMContentLoaded", function () {
    let selector = document.querySelector('#test-no-selecter');
    let table = $('#content-table').DataTable({
        "order": [
            [1, "desc"]
        ],
        "lengthChange": false
    });

    data.forEach(function(value, key, map){
        let node = document.createElement("option");
        let textnode = document.createTextNode(key); 
        node.appendChild(textnode);
        selector.appendChild(node);
    });

    function updatePageDate(){
        let totalSpan = document.querySelector('#pieces-quantity');
        let value = data.get(parseInt(selector.value)) || data.get(selector.value);

        table.clear();

        for(let element of value.array){
            table.row.add([element.name, element.quantity]);
        }

        table.draw();
        totalSpan.innerText = value.total;
    }

    selector.addEventListener('change', updatePageDate);
    updatePageDate();
});

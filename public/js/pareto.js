document.addEventListener("DOMContentLoaded", function () {
    let selector = document.querySelector('#test-no-selecter');

    data.forEach(function(value, key, map){
        let node = document.createElement("option");
        let textnode = document.createTextNode(key); 
        node.appendChild(textnode);
        selector.appendChild(node);
    });

    let updatePageDate = function(){
        let totalSpan = document.querySelector('#pieces-quantity');
        let tableContent = document.querySelector('#content-table tbody');
        let value = data.get(parseInt(selector.value));

        let tableNewContent = document.createElement("tbody");

        for(let element of value.array){
            let row = document.createElement("tr");
            let nameCell = document.createElement("td");
            let quantityCell = document.createElement("td");
            let nameText = document.createTextNode(element.name); 
            let quantityText = document.createTextNode(element.quantity); 

            nameCell.appendChild(nameText);
            quantityCell.appendChild(quantityText);
            row.appendChild(nameCell);
            row.appendChild(quantityCell);

            tableNewContent.appendChild(row);
        }

        tableContent.parentNode.replaceChild(tableNewContent, tableContent);
        totalSpan.innerText = value.total;
    }

    selector.addEventListener('change', updatePageDate);
    updatePageDate();
});

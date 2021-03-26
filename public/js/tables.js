document.addEventListener("DOMContentLoaded", function () {
  let selector = document.querySelector('#test-no-selecter');
  let table = $('#content-table').DataTable({
      "order": [
          [1, "desc"]
      ],
      "columns": [
          { "data": "dut_no" },
          { "data": "test_no" },
          { "data": "test" },
          { "data": "flag" },
          { "data": "result1" },
          // { "data": "result2" },
          // { "data": "result3" }
      ]
  });

  data.forEach(function(value, key, map){
      let node = document.createElement("option");
      let textnode = document.createTextNode(key); 
      node.appendChild(textnode);
      selector.appendChild(node);
  });

  function updatePageDate(){
      let array = data.get(parseInt(selector.value)) || data.get(selector.value);

      table.clear().rows.add(array).draw();
  }

  selector.addEventListener('change', updatePageDate);
  updatePageDate();
});

document.addEventListener('DOMContentLoaded', function(){
    let noSelector = document.querySelector('#test-no-selector');
    
    data.forEach(function(value, key, map){
        let option = document.createElement('option');
        let text = document.createTextNode(key);

        option.appendChild(text);
        noSelector.appendChild(option);
    });

    noSelector.addEventListener('change', updateData);
    updateData();

    function updateData(){
        let actual = data.get(parseInt(noSelector.value)) || data.get(noSelector.value);
        let startDate = new Date(actual.date_time);
        
        // document.getElementById('fileName').innerHTML = actual.fileName;
        document.getElementById('test_date').innerHTML = `${startDate.getDate()}/${startDate.getMonth()+1}/${startDate.getFullYear()}`;
        document.getElementById('test_time').innerHTML = `${startDate.getHours()}:${startDate.getMinutes() < 10? '0'+startDate.getMinutes() : startDate.getMinutes()}:${startDate.getSeconds() < 10? '0'+startDate.getSeconds() : startDate.getSeconds()}`;
        document.getElementById('pn').innerHTML = actual.dut_no;
        document.getElementById('appl').innerHTML = actual.test_type;
        // document.getElementById('rev').innerHTML = actual.rev;
        document.getElementById('plt').innerHTML = actual.plt;
        // document.getElementById('lot').innerHTML = actual.lot;
        document.getElementById('dc').innerHTML = actual.datecode;
    }
});
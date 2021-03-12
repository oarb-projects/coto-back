$(document).ready(function(){
  $('select').formSelect();
  var elems = document.querySelectorAll(".datepicker");
  var instances = M.Datepicker.init(elems, {
    format: "yyyy-mm-dd",
    showClearBtn: true,
  });

  $.validator.addClassRules("filter-group", { 
    require_from_group: [1,".filter-group"]
  });

  $("#filter-form").submit(function(e) {
    e.preventDefault();
  }).validate({
    invalidHandler: function(){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Select at least one parameter",
      });
    },
    submitHandler: function(form) {
      let url = $('#filter-form').serialize();
      if($('#application').val()){
        url += '&application=' + $('#application option:selected').text();
      }
      if($('#selection').val()){
        url += '&selection=' +$('#selection option:selected').text();
      }

      window.location.href = `/summary?${url}`;
    },
   });
  
});
        
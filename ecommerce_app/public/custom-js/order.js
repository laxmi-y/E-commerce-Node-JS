var modal = document.getElementById("addressModel");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

$(".openAddress").click(function(){
    debugger;
  modal.style.display = "block";
  $('#country').val( $(this).parent().find("#country").text().trim())
  $('#add').val( $(this).parent().find("#add").text().trim())
  $('#city').val($(this).parent().find("#city").text().trim())
  $('#zip').val($(this).parent().find("#zip").text().trim())
})

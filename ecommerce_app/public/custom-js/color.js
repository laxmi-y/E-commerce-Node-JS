var modal = document.getElementById("myModal");
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

$(".updateColor").click(function(){
  debugger
  var id = $(this).parent().find("span").text().trim()
  modal.style.display = "block";
  $('#id').val(id)
  $('#color').val($(this).parent().parent().find("#color").text().trim())
})

$(".edits").click(function(){
  var id = $("#id").val()
  var categ = {
    'color': $('#color').val(),
}
  $.ajax({url: "/color/"+id,
  method :'patch',data : categ, success: function(result){
    // alert("Color has been updated")
    location.replace('/admin-color')
  }});
});

$(".deleteColor").click(function(){
  var id = $(this).parent().find("span").text().trim()
  $.ajax({url: "/color/"+id,
  method :'Delete', success: function(result){
    // alert(result)
    location.replace('/admin-color')
  }});
});


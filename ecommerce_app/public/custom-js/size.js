
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

$(".updateSize").click(function(){
  var id = $(this).parent().find("span").text().trim()
  modal.style.display = "block";
  $('#id').val(id)
  $('#size').val($(this).parent().parent().find("#size").text().trim())
})

$(".edits").click(function(){
  var id = $("#id").val()
  var categ = {
    'size': $('#size').val(),
    }
  $.ajax({url: "/size/"+id,
  method :'patch',data : categ, success: function(result){
    // alert("Size has been updated")
    location.replace('/admin-size')
  }});
});

$(".deleteSiz").click(function(){
  var id = $(this).parent().find("span").text().trim()
  $.ajax({url: "/size/"+id,
  method :'Delete', success: function(result){
    // alert(result)
    location.replace('/admin-size')
  }});
});


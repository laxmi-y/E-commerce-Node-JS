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

$(".updateCats").click(function(){
  debugger
  var id = $(this).parent().find("span").text().trim()
  modal.style.display = "block";
  $('#id').val(id)
  $('#name').val($(this).parent().parent().find("#category").text().trim())
})

$(".editCatg").click(function(){
  var id = $("#id").val()
  var categ = {
    'name': $('#name').val(),
}
  $.ajax({url: "/category/"+id,
  method :'patch',data : categ, success: function(result){
    location.replace('/admin-category')
  }});
});


$(".deleteCateg").click(function(){
  var id = $(this).parent().find("span").text().trim()
  $.ajax({url: "/category/"+id,
  method :'Delete', success: function(result){
    // alert(result)
    location.replace('/admin-category')
  }});
});


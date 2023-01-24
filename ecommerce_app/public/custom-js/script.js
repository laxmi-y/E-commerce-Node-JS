
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

$(".update").click(function(){
  var id = $(this).parent().find("span").text().trim()
  modal.style.display = "block";
  $('#id').val(id)
  $('#name').val( $(this).parent().parent().find("#title").text().trim())
  $('#price').val( $(this).parent().parent().find("#price").text().trim())
  $('#category').val($(this).parent().parent().find("#category").text().trim())
  $('#color').val($(this).parent().parent().find("#color").text().trim())
  $('#size').val($(this).parent().parent().find("#size").text().trim())
})

$(".editData").click(function(){
  var id = $("#id").val()
  var product = {
    'title': $('#name').val(),
    'price': $('#price').val(),
    'categories': $('#category').val(),
    'color': $('#color').val(),
    'size': $('#size').val(),
}
  $.ajax({url: "/api-products/"+id,
  method :'put',data : product, success: function(result){
    // alert("Product has been updated")
    location.replace('/')
  }});
});


$(".deleteProduct").click(function(){
  var id = $(this).parent().find("span").text().trim()
  $.ajax({url: "/api-products/"+id,
  method :'Delete', success: function(result){
    // alert(result)
    location.replace('/')
  }});
});


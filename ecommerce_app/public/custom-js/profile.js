var modal = document.getElementById("updateProfile");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
    debugger
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

$(".update-profile").click(function(){
    debugger
    var email = $('.email').text().trim()
    var phone = $('.phone').text().trim()
    var name = $('.name').text().trim()
    var id = $('.userId').text().trim()
    modal.style.display = "block";
    $('#id').val(id)
    $('#name').val(name)
    $('#email').val(email)
    $('#phone').val(phone)
})

$(".pUpdate").click(function(){
  var id = $("#id").val()
  var user = {
    'id' : $('#id').val(),
    'name': $('#name').val(),
    'email': $('#email').val(),
    'phone': $('#phone').val(),
  }
  $.ajax({url: "/update-profile-admin",
  method :'post',data : user, success: function(result){
    // alert("profile has been updated")
    location.replace('/profile')
  }});

})


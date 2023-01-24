var modal = document.getElementById("createCategory");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

$(".category").click(function () {
    $("#select").val("#categ")
    modal.style.display = "block";
})

$(".createCategory").click(function () {
    var categ = {
        "name": $("#name").val(),
    }
    $.ajax({
        url: "/create-category/",
        method: 'post', data: categ, success: function (result) {
            $($("#select").val()).append(`<option value="${result.name}">
            ${result.name}</option>`);
            $("#name").val(" ")
            // alert("Category has been created")
            modal.style.display = "none";
        }
    });
})


var modalSize = document.getElementById("createSize");
var span_size = document.getElementsByClassName("close-btn-size")[0];
span_size.onclick = function () {
    modalSize.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modalSize) {
        modalSize.style.display = "none";
    }
}
$(".size").click(function(){
    $("#selectSize").val("#pSize")
    modalSize.style.display = "block";
})

$(".createSize").click(function () {
    var categ = {
        "size": $("#size").val(),
    }
    $.ajax({
        url: "/create-size/",
        method: 'post', data: categ, success: function (result) {
            debugger
            $($("#selectSize").val()).append(`<option value="${result.size}">
            ${result.size}</option>`);
            $("#size").val(" ")
            // alert("Size has been created")
            modalSize.style.display = "none";
        }
    });
})

var modalColor = document.getElementById("createColor");
var span = document.getElementsByClassName("close-color")[0];
span.onclick = function () {
    modalColor.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modalColor) {
        modalColor.style.display = "none";
    }
}
$(".color").click(function(){
    $("#selectColor").val("#pColor")
    modalColor.style.display = "block";
})
$(".createColor").click(function () {
    var categ = {
        "color": $("#color").val(),
    }
    $.ajax({
        url: "/create-color/",
        method: 'post', data: categ, success: function (result) {
            debugger
            $($("#selectColor").val()).append(`<option value="${result.color}">
            ${result.color}</option>`);
            // alert("Color has been created")
            $("#color").val(" ")
            modalColor.style.display = "none";
        }
    });
})
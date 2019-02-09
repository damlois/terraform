function validateForm(){
    
var name = document.getElementById("name");

name.addEventListener("input", function (event) {
  if (name.validity.typeMismatch) {
    name.setCustomValidity("pleaase, enter your name");
  } else {
    name.setCustomValidity("");
  }
});
}
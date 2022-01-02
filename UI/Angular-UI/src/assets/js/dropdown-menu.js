
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}


// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {

  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
  if (!event.target.matches('.drowpdown-input') && !event.target.matches('.ParamSearch')) {
    var dropdowns = document.getElementsByClassName("ParamSearch");

    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      openDropdown.style.display = "none";
    }
  }
  if (!event.target.matches('.search_input') && !event.target.matches('.dropdown-search')) {
    var dropdowns = document.getElementsByClassName("dropdown-search");

    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      openDropdown.style.display = "none";
    }
  }
  var width = screen.width;
  if (width <= 900) {

    
    if (event.target.matches('.menu1')) {

      
      var button = document.getElementsByClassName("navbar-toggler");

      if (button.length > 0) {

        var menu2 = document.getElementsByClassName("menu2");
        button[0].click();
        //var i;
        //for (i = 0; i < menu2.length; i++) {
        //  var openDropdown = menu2[i];
        //  openDropdown.style.display = "none";
        //  if (i == 0) {
           
        //  }

        //}

      }


    }
  }
}


$(function () {
  $('li').click(function () {
    $(this).toggleClass('done');
  });
});



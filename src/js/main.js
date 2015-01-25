(function responsiveMenu() {
  var menuOpened = false;
  var menuButton = document.querySelector('.burger');
  var menuItems = document.querySelectorAll('.menu a');

  var openMenu = function(e) {
    e.preventDefault();

    if (menuOpened) {
      document.body.className = '';
    } else {
      document.body.className = 'active';
    }

    menuOpened = !menuOpened;
  };

  var clickItemMenu = function() {
    document.body.className = '';
  }

  menuButton.addEventListener('click', openMenu);

  for (var i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', clickItemMenu);
  }
}());

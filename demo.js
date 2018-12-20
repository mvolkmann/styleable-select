function demoSetup() {
  var selects = document.querySelectorAll('.styleable-select');
  for (var i = 0; i < selects.length; i++) {
    var select = selects.item(i);
    select.addEventListener('blur', function (event) {
      console.log('got blur event:', event);
      console.log('value =', event.target.value);
    });
    select.addEventListener('change', function (event) {
      console.log('got change event:', event);
      console.log('value =', event.target.value);
    });
  }
}

window.addEventListener('load', demoSetup);

/* eslint-disable no-var */
function demoSetup() {
  var selects = document.querySelectorAll('.styleable-select');
  for (var i = 0; i < selects.length; i++) {
    var select = selects.item(i);
    function blurListener(event) {
      console.log('got blur event: event.target.value =', event.target.value);
    }
    function changeListener(event) {
      console.log('got change event: event.target.value =', event.target.value);
    }
    select.addEventListener('blur', blurListener);
    select.addEventListener('change', changeListener);
  }
}

window.addEventListener('load', demoSetup);

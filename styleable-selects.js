/* eslint-disable no-var */
function makeStyleableSelects() {
  function addClass(element, className) {
    var classes = element.className.split(' ');
    for (var i = 0; i < classes.length; i++) {
      if (classes[i] === className) return;
    }
    classes.push(className);
    element.className = classes.join(' ');
  }

  function closeList(select) {
    var list = select.querySelector('.styleable-select-list');
    list.style.display = 'none';
    removeClass(list, 'open');

    var img = select.querySelector('.styleable-select-current > img');
    removeClass(img, 'open');
  }

  function findAncestorByClass(element, className) {
    while (element && !hasClass(element, className)) {
      element = element.parentNode;
    }
    return element;
  }

  function hasClass(element, className) {
    var classes = element.className ? element.className.split(' ') : [];
    for (var i = 0; i < classes.length; i++) {
      if (classes[i] === className) return true;
    }
    return false;
  }

  function removeClass(element, className) {
    var classes = element.className.split(' ');
    classes = classes.filter(c => c !== className);
    element.className = classes.join(' ');
  }

  function setValue(option) {
    var select = findAncestorByClass(option, 'styleable-select');
    var span = select.querySelector('.styleable-select-current > span');
    var newValue = option.textContent;
    span.textContent = newValue;
    select.value = option.getAttribute('value') || newValue;

    closeList(select);

    var event = document.createEvent('UIEvents');
    event.initEvent('change', true, true);
    select.dispatchEvent(event);

    event = document.createEvent('UIEvents');
    event.initEvent('blur', true, true);
    select.dispatchEvent(event);
  }

  function toggleOpen(event) {
    var select = findAncestorByClass(event.target, 'styleable-select');
    var span = select.querySelector('.styleable-select-current > span');
    var img = select.querySelector('.styleable-select-current > img');
    var list = select.querySelector('.styleable-select-list');
    var shouldOpen = list.style.display !== 'block';

    if (shouldOpen) {
      // Mark one of the options as the current one.
      var v = span.textContent;
      var options = list.querySelectorAll('option');
      var found = false;

      for (var i = 0; i < options.length; i++) {
        var option = options.item(i);
        if (!found && option.textContent === v) {
          addClass(option, 'current');
          found = true;
        } else {
          removeClass(options[i], 'current');
        }
      }

      if (!found) addClass(options[0], 'current');

      addClass(list, 'open');
    } else {
      removeClass(list, 'open');
    }

    list.style.display = shouldOpen ? 'block' : 'none';
    img.setAttribute('class', shouldOpen ? 'open' : '');
  }

  var selects = document.querySelectorAll('select');
  for (var i = 0; i < selects.length; i++) {
    var select = selects.item(i);

    // Build the new element structure that will replace the select.
    var newSelect = document.createElement('div');
    newSelect.setAttribute('class', 'styleable-select');
    newSelect.setAttribute('tabindex', 0);

    var current = document.createElement('div');
    addClass(current, 'styleable-select-current');
    var span = document.createElement('span');
    current.appendChild(span);
    var img = document.createElement('img');
    img.setAttribute('src', 'down-angle.png');
    current.appendChild(img);
    newSelect.appendChild(current);

    var list = document.createElement('div');
    addClass(list, 'styleable-select-list');

    var value = select.getAttribute('value');
    if (value) value = value.trim();

    // Move option children from select to current.
    var options = select.querySelectorAll('option');
    for (var j = 0; j < options.length; j++) {
      var option = options.item(j);
      if (value === option.getAttribute('value')) {
        span.textContent = option.textContent;
      }
      list.appendChild(option);
    }

    if (!value) span.textContent = options[0].textContent;
    if (!value) current.style.height = '18px';

    newSelect.appendChild(list);

    // Replace the select with the new structure.
    var parent = select.parentNode;
    parent.replaceChild(newSelect, select);

    newSelect.onblur = function (event) {
      var select = findAncestorByClass(event.target, 'styleable-select');
      closeList(select);
    };

    newSelect.onkeydown = function (event) {
      //console.log('keydown: event.which =', event.which);
      var select = findAncestorByClass(event.target, 'styleable-select');
      var list = select.querySelector('.styleable-select-list');

      // Find index of current option.
      var options = list.querySelectorAll('option');
      var index = 0;
      var option;
      for (; index < options.length; index++) {
        option = options[index];
        if (hasClass(option, 'current')) break;
      }

      var isEnter = event.which === 13;
      var isSpace = event.which === 32;
      var isEsc = event.which === 27;
      var isDown = event.which === 40;
      var isUp = event.which === 38;
      var isExpectedKey = isEnter || isDown || isUp;
      var nothingSelected = index === options.length;

      if ((isEnter || isSpace) && hasClass(list, 'open')) {
        setValue(option);
      } else if (isSpace) {
        toggleOpen(event);
      } else if (nothingSelected && isExpectedKey) {
        addClass(options[0], 'current');
        toggleOpen(event);
      } else if (!hasClass(list, 'open')) {
        if (isExpectedKey) {
          addClass(list, 'open');
          list.style.display = 'block';
        }
      } else if (isEsc) {
        closeList(select);
      } else if (isUp) {
        if (index === 0) return;
        removeClass(options[index], 'current');
        addClass(options[index - 1], 'current');
      } else if (isDown) {
        if (index === options.length - 1) return;
        removeClass(options[index], 'current');
        addClass(options[index + 1], 'current');
      }
    };

    current.onclick = toggleOpen;

    for (var j = 0; j < options.length; j++) {
      var option = options.item(j);

      option.onclick = function () {
        setValue(this);
      };
    }
  }
}

window.addEventListener('load', makeStyleableSelects);

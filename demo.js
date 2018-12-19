function onLoad() {
  const select = document.querySelector('.my-select');
  const current = select.querySelector('.my-select-current');
  const value = current.querySelector('.value');
  const list = select.querySelector('.my-select-list');
  const options = list.querySelectorAll('option');

  current.onclick = () => {
    var style = list.style;
    var display = style.display;
    var newDisplay = style.display === 'none' ? 'block' : 'none';
    list.style.display = newDisplay;
  };

  for (var i = 0; i < options.length; i++) {
    const option = options.item(i);
    option.onclick = () => {
      value.textContent = option.textContent;
      list.style.display = 'none';
    };
  }
}

window.onload = onLoad;

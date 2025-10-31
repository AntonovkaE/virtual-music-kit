const notes = {
  do: { key: 'A', sound: './assets/noty-do.mp3', label: 'Do' },
  re: { key: 'S', sound: './assets/re.mp3', label: 'Re' },
  mi: { key: 'D', sound: './assets/mi.mp3', label: 'Mi' },
  fa: { key: 'F', sound: './assets/fa.mp3', label: 'Fa' },
  sol: { key: 'G', sound: './assets/sol.mp3', label: 'Sol' },
  la: { key: 'H', sound: './assets/lja.mp3', label: 'La' },
  si: { key: 'J', sound: './assets/si.mp3', label: 'Si' },
};
let keyLocked = false;

const keysArr = [];
for (let note in notes) {
  keysArr.push(notes[note].key);
}
const fragment = document.createDocumentFragment();

function createElement(tag, classes = '', content = '', parent = fragment) {
  const el = document.createElement(tag);
  el.className = classes;
  if (content) el.innerHTML = content;
  parent.appendChild(el);
  return el;
}

const main = createElement('main', 'container main', '', fragment);

const keyboard = createElement('div', 'keyboard', '', main);

for (let key in notes) {
  const keyWrapper = createElement('div', 'key-wrapper', '', keyboard);
  const button = createElement('button', 'key', '', keyWrapper);
  const input = createElement('input', 'input', '', button);
  input.value = notes[key].key;
  input.id = notes[key].key;
  input.minlenght = 1;
  input.maxlenght = 1;
  // input.placeholder = notes[key].key;
  input.disabled = true;
  input.focus();
  input.addEventListener('input', (e) => {
    input.focus();
    const value = e.target.value.toUpperCase();
    if (!/^[A-Z]$/.test(value) || keysArr.includes(value)) {
      e.target.value = '';
    } else {
      e.target.value = value.toUpperCase();
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      console.log('h');
      const value = input.value.toUpperCase();
      if (value && /^[A-Z]$/.test(value) && !keysArr.includes(value)) {
        input.disabled = true;
        keysArr.splice(keysArr.indexOf(e.target.id), 1);
        input.id = value;
        notes[key].key = e.target.id;
        keysArr.push(value);
        console.log(keysArr);
      }
    }
  });
  input.addEventListener('blur', () => {
    if (!input.disabled) {
      console.log(input, input.value);
      input.value = input.id.toUpperCase();
      input.disabled = true;
    }
  });
  let audio = new Audio(notes[key].sound);
  ;
  // button.addEventListener('mousedown', (e) => {
  //   e.repeat = false;
  //   audio.play();
  // });
  button.addEventListener('click', (e) => {
    e.repeat = false;
    audio.play();
  });
  // button.addEventListener('mouseup', () => {
  //   audio.pause();
  // });

  const editButton = createElement('button', 'btn btn-light', 'edit', keyWrapper);
  editButton.addEventListener('click', (event) => {
    input.focus();
    input.disabled = false;
  });
}

const control = createElement('div', 'input-group control', '', main);
const playInput = createElement('input', 'control__input', '', control);
const submitButton = createElement('button', 'btn btn-outline-success control__submit', 'submit', control);
playInput.id = 'playInput';
playInput.type = 'text';
playInput.setAttribute('maxlength', '14');
let song = '';
playInput.addEventListener('input', (e) => {
  const arr = document.querySelectorAll('.key');
  arr.forEach(item => {
    return item.disabled = true;
  });
  playInput.focus();
  const value = e.data.toUpperCase();
  console.log(value, !/^[A-Z]$/.test(value), !keysArr.includes(value));
  if (!/^[A-Z]$/.test(value) || !keysArr.includes(value)) {
    console.log('не подходит', song);
    e.target.value = song;
    return;
  }
  if (song.length < 14) {
    song += e.data;
  }

});

document.body.appendChild(fragment);

const keys = document.querySelectorAll('.key');
document.addEventListener('keydown', (e) => {
  e.repeat = false;
  if (keyLocked && !e.repeat) {
    return;
  }
  const code = e.code.slice(3);
  if (keysArr.includes(code)) {
    keyLocked = true;
    const b = document.getElementById(code).parentNode;
    b.click();
    b.classList.add('key_active');
  }
});

document.addEventListener('keyup', (e) => {
  const activeKey = document.querySelector('.key_active');
  if (activeKey) {
    const child = activeKey.firstChild;
    if (child.id === e.code.slice(3)) {
      keyLocked = false;
      activeKey.classList.remove('key_active');
    }
  }
});

//The visual element switches to its active state, which lasts as long as the user keeps pressing the key or mouse.
//Only one key can be processed at a time. If the user attempts to press multiple keys simultaneously, the application should process only the first key press detected to prevent multiple inputs from being registered at the same moment.

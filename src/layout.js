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
const audioCache = {};
const activeSounds = {};
function  playSound(note) {
  if (keyLocked) return;
  keyLocked = true;
  if (activeSounds[note]) return;
  const sound = audioCache[note].cloneNode();
  sound.currentTime = 0;
  activeSounds[note] = sound;
  sound.play().catch(error => console.log(error))
}
function stopSound(note, isAutoplay = false) {
  const sound = activeSounds[note];
  const button = document.getElementById(note)
  if (button.classList.contains('key_active')) {
    button.classList.remove('key_active')
  }
  if (isAutoplay) {
    button.disabled = true;
  }
  if (sound) {
    keyLocked = false;
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
      delete activeSounds[note];

    }, 700);
  }
}

function buttonClicked (input) {
  const b = document.getElementById(input).parentNode;
  b.disabled = false;
  const mouseDownEvent = new MouseEvent('mousedown', {
    bubbles: true, // Событие будет всплывать
    cancelable: true, // Событие можно отменить
    button: 0 // 0 - левая кнопка мыши
  });
  b.dispatchEvent(mouseDownEvent);
  b.classList.add('key_active');
  playSound(b.id)
}

function getNoteByKey(key) {
  for (let note in notes) {
    if (notes[note].key === key.toUpperCase()) {
      return note;
    }
  }
}

function playNotePromise(note, delay = 2000) {
  return new Promise(resolve => {
    buttonClicked(note.toUpperCase());
    setTimeout(() => {
      stopSound(getNoteByKey(note), true)
      resolve();
    }, delay);
  });
}

const keysArr = [];
for (let note in notes) {
  keysArr.push(notes[note].key);
}
const fragment = document.createDocumentFragment();

function createElement(tag, classes = '', content = '', parent = fragment) {
  const el = document.createElement(tag);
  el.className = classes;
  if (content) el.textContent = content;
  parent.appendChild(el);
  return el;
}

const main = createElement('main', 'container main', '', fragment);

const keyboard = createElement('div', 'keyboard', '', main);


for (let key in notes) {
  audioCache[key] = new Audio(notes[key].sound)
  const keyWrapper = createElement('div', 'key-wrapper', '', keyboard);
  const button = createElement('button', 'key', '', keyWrapper);
  const input = createElement('input', 'input', '', button);
  button.id = key;
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
      const value = input.value.toUpperCase();
      if (value && /^[A-Z]$/.test(value) && !keysArr.includes(value)) {
        input.disabled = true;
        keysArr.splice(keysArr.indexOf(e.target.id), 1);
        input.id = value;
        notes[key].key = e.target.id;
        keysArr.push(value);
      }
    }
  });
  input.addEventListener('blur', () => {
    if (!input.disabled) {
      input.value = input.id.toUpperCase();
      input.disabled = true;
    }
  });

  button.addEventListener('mousedown', (e) => {
    e.repeat = false;
    playSound(key)
  });

  button.addEventListener('mouseup', () => {
    stopSound(key);
  });

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

document.body.appendChild(fragment);
const arr = document.querySelectorAll('.key');

submitButton.disabled = true;
let song = '';

playInput.addEventListener('input', (e) => {
  playInput.focus();
  let value = '';
  if (e.data) {
    value = e.data.toUpperCase();
  }
  if (!/^[A-Z]$/.test(value) || !keysArr.includes(value)) {
    e.target.value = song;
    return;
  }
  if (song.length < 14) {
    song += e.data;
  }
  if (song.length > 0) {
    submitButton.disabled = false;
  }

});
playInput.addEventListener('keydown', (e) => {
  if (e.code === 'Backspace' || e.code === 'Delete') {
    if (song.length === 1) {
      submitButton.disabled  = true;
    }
    if (e.code === 'Backspace') {
      song = song.slice(0, song.length - 1);
    }
    if (e.code === 'Delete') {

    }
  }
})
submitButton.addEventListener('click', async (e) => {
  arr.forEach(item => {
    return item.disabled = true;
  });
  const notes = song.split('');
  for (let i = 0; i < notes.length; i++) {
    await playNotePromise(notes[i]);
  }
  document.querySelectorAll('.key_active').forEach(el => el.classList.remove('key_active'));
  arr.forEach(item => item.disabled = false);
  submitButton.disabled = true;
  document.getElementById('playInput').value = '';
  song = ''
})

document.addEventListener('keydown', (e) => {
  e.repeat = false;
  if (keyLocked && !e.repeat || e.target.id === "playInput") {
    return;
  }
  const code = e.code.slice(3);
  if (keysArr.includes(code)) {
    buttonClicked(code);

  }
});

document.addEventListener('keyup', (e) => {
  const activeKey = document.querySelector('.key_active');
  if (keysArr.includes(e.code.slice(3))) {
    const button = document.getElementById(e.code.slice(3)).parentNode;
    if (activeKey) {
      const child = activeKey.firstChild;
      if (child.id === e.code.slice(3)) {
        keyLocked = false;
        activeKey.classList.remove('key_active');
        stopSound(button.id)
      }
    }
  }
});


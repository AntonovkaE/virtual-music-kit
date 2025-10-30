const notes = {
  do: {key: "A", sound: "./assets/noty-do.mp3", label: "Do" },
  re: {key: "S", sound: "./assets/re.mp3", label: "Re" },
  mi: {key: "D", sound: "./assets/mi.mp3", label: "Mi" },
  fa: {key: "F", sound: "./assets/fa.mp3", label: "Fa" },
  sol: {key: "G", sound: "./assets/sol.mp3", label: "Sol" },
  la: {key: "H", sound: "./assets/lja.mp3", label: "La" },
  si: {key: "J", sound: "./assets/si.mp3", label: "Si" }
};

const keysArr = [];
for (let note in notes) {
  keysArr.push(notes[note].key)
}
const fragment = document.createDocumentFragment();

function createElement(tag, classes = '', content = '', parent = fragment) {
  const el = document.createElement(tag);
  if (classes.length) el.classList= classes;
  if (content) el.innerHTML = content;
  parent.appendChild(el);
  return el;
}

const main = createElement('main', 'main', '', fragment);

const keyboard = createElement('div', 'keyboard', '', main);

for (let key in notes) {
  const keyWrapper = createElement('div', 'key-wrapper', '', keyboard)
  const button = createElement('button', 'key', '', keyWrapper);
  const input = createElement('input', 'input', '', button);
  input.value = notes[key].key;
  input.id = notes[key].key;
  input.minlenght = 1;
  input.maxlenght = 1;
  // input.placeholder = notes[key].key;
  input.disabled = true;
  input.focus();
  let v = notes[key].key;
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
        input.id = value;
        notes[key].key = e.target.id;
      }
    }
  });
  input.addEventListener('blur', () => {
    if (!input.disabled) {
      console.log(input, input.value)
      input.value = input.id.toUpperCase();
      input.disabled = true;
    }
  });
  button.addEventListener('click', () => {
    const audio = new Audio(notes[key].sound);
    audio.play();
  })
  const editButton = createElement('button', 'btn btn-light', 'edit', keyWrapper);

  editButton.addEventListener('click', (event) => {
    input.focus()
    input.disabled = false;
  })
}


document.body.appendChild(fragment);

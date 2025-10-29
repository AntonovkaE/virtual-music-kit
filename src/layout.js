const notes = {
  A: { sound: "./assets/noty-do.mp3", label: "Do (A)" },
  S: { sound: "./assets/re.mp3", label: "Re (S)" },
  D: { sound: "./assets/mi.mp3", label: "Mi (D)" },
  F: { sound: "./assets/fa.mp3", label: "Fa (F)" },
  G: { sound: "./assets/sol.mp3", label: "Sol (G)" },
  H: { sound: "./assets/lja.mp3", label: "La (H)" },
  J: { sound: "./assets/si.mp3", label: "Si (J)" }
};
const fragment = document.createDocumentFragment();

function createElement(tag, classes = [], content = '', parent = fragment) {
  const el = document.createElement(tag);
  if (classes.length) el.classList.add(...classes);
  if (content) el.innerHTML = content;
  parent.appendChild(el);
  return el;
}

const main = createElement('main', ['main'], '', fragment);

const keyboard = createElement('div', ['keyboard'], '', main);

for (let key in notes) {
  const button = createElement('button', ['key'], key, keyboard);
  button.addEventListener('click', () => {
    const audio = new Audio(notes[key].sound);
    audio.play();
  })
}
document.body.appendChild(fragment);

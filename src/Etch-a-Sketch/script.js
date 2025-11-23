const container = document.querySelector('#container');
let height = document.querySelector('#height').value;
let width = document.querySelector('#width').value;

// In HTML it would be onInput, onMouseOver, onClick, etc.
document.querySelector('#height').addEventListener('input', () => {
  height = document.querySelector('#height').value;
  // .textContent is only text and .innerHTML are also Nodes
  container.innerHTML = '';
  createGrid();
});

document.querySelector('#width').addEventListener('input', () => {
  width = document.querySelector('#width').value;
  container.innerHTML = '';
  createGrid();
});

function createGrid() {
  for (let i = 0; i < height; i++) {
    const column = document.createElement('div');
    column.classList.add('column');
    // appendChild is older and only supports Nodes
    // append is modern and allows multiple appends and text
    container.appendChild(column);
    for (let j = 0; j < width; j++) {
      const box = document.createElement('div');
      box.classList.add('box');
      column.appendChild(box);
    }
  }

  const boxes = document.querySelectorAll('.box');

  boxes.forEach((box) => {
    box.addEventListener('mouseover', () => {
      if (box.style.backgroundColor === '') {
        box.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
        box.style.opacity = 0.2;
      } else {
        //CSS values are always strings
        box.style.opacity = (parseFloat(box.style.opacity) + 0.2).toString();
      }
    });
  });
}

createGrid();

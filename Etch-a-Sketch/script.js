const container = document.querySelector('#container');
let height = document.querySelector('#height').value;
let width = document.querySelector('#width').value;

document.querySelector('#height').addEventListener('input', () => {
  height = document.querySelector('#height').value;
  container.innerHTML = '';
  createGrid();
});

document.querySelector('#width').addEventListener('input', () => {
  width = document.querySelector('#width').value;
  container.innerHTML = '';
  createGrid();
});

function createGrid() {
  for (i = 0; i < height; i++) {
    const column = document.createElement('div');
    column.classList.add('column');
    container.appendChild(column);
    for (j = 0; j < width; j++) {
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
        box.style.opacity = (parseFloat(box.style.opacity) + 0.2).toString();
      }
    });
  });
}

createGrid();

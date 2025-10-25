class Book {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public pages: number,
    public read: boolean,
    public shelf: number,
    public color: string,
    public width: number,
  ) {}

  public info() {
    if (this.read) {
      return `${this.title} by ${this.author}, ${this.pages} pages, already read.`;
    }
    return `${this.title} by ${this.author}, ${this.pages} pages, not read yet.`;
  }
}

interface AddBookForm {
  title: string;
  author: string;
  pages: number;
  read: boolean;
  shelf: number;
}

const libraryMap = new Map();

const form = document.querySelector('#addBookForm') as HTMLFormElement;
const dialog = document.querySelector('dialog');
document.querySelector('#newBook')?.addEventListener('click', () => {
  dialog?.showModal();
});

document.querySelector('#addBookForm')!.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const formData: AddBookForm = {
    title: data.get('title') as string,
    author: data.get('author') as string,
    pages: Number(data.get('pages')),
    read: data.get('read') === 'on',
    shelf: Number(data.get('shelf')),
  };

  const bgColor = getRandomColor();
  const book = new Book(
    crypto.randomUUID(),
    formData.title,
    formData.author,
    formData.pages,
    formData.read,
    formData.shelf,
    bgColor,
    Math.floor(Math.random() * 50 + 50),
  );

  libraryMap.set(book.id, book);
  createBook(book, bgColor);

  requestAnimationFrame(() => {
    dialog?.close();
  });
});

function createBook(book: Book, bgColor: string) {
  const bookshelfRow = document.querySelector(`.shelf-${book.shelf}`);

  const bookDiv = document.createElement('div');
  bookDiv.className = 'book';
  bookDiv.id = crypto.randomUUID();
  bookDiv.innerHTML = `
        <div class="title">${book.title}</div>
        <div class="spine"></div>
        <div class="left"></div>
        <div class="right"></div>
        <div class="top"></div>
    `;
  bookDiv.style.backgroundColor = book.color;
  bookDiv.style.color = getReadableTextColor(bgColor);
  bookDiv.style.width = book.width + 'px';
  const height = Math.floor(Math.random() * 20 + 60);
  //bookDiv.style.height = height + '%';
  bookDiv.style.height = '150px';
  const translateZ = Math.floor(Math.random() * 100) - 50;
  bookDiv.dataset.zDepth = translateZ.toString();
  bookDiv.style.transform = `translateZ(${translateZ}px)`;

  bookshelfRow?.append(bookDiv);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getReadableTextColor(bgColor: string) {
  const r = parseInt(bgColor.substr(1, 2), 16);
  const g = parseInt(bgColor.substr(3, 2), 16);
  const b = parseInt(bgColor.substr(5, 2), 16);

  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  let textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

  if (Math.random() < 0.2) {
    if (luminance < 0.7) {
      textColor = 'gold';
    }
  }

  return textColor;
}

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

const books = [
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', pages: 281 },
  { title: '1984', author: 'George Orwell', pages: 328 },
  { title: 'Moby-Dick', author: 'Herman Melville', pages: 635 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', pages: 279 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', pages: 180 },
  { title: 'War and Peace', author: 'Leo Tolstoy', pages: 1225 },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', pages: 214 },
  { title: 'Brave New World', author: 'Aldous Huxley', pages: 311 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', pages: 310 },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', pages: 671 },
  { title: 'The Odyssey', author: 'Homer', pages: 541 },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', pages: 500 },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', pages: 194 },
  { title: 'Wuthering Heights', author: 'Emily Brontë', pages: 416 },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', pages: 1178 },
  { title: 'Animal Farm', author: 'George Orwell', pages: 112 },
  { title: 'Les Misérables', author: 'Victor Hugo', pages: 1463 },
  { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', pages: 824 },
  { title: 'The Grapes of Wrath', author: 'John Steinbeck', pages: 464 },
  { title: 'Don Quixote', author: 'Miguel de Cervantes', pages: 982 },
];

books.forEach((book) => {
  addBook(
    book.title,
    book.author,
    book.pages,
    Math.floor(Math.random() * 2) > 0 ? true : false,
    Math.floor(Math.random() * 3) + 1,
  );
});

const form = document.querySelector('#addBookForm') as HTMLFormElement;
const showBookDialog = document.querySelector(
  '#showBookDialog',
) as HTMLDialogElement;

document.querySelector('#closeDialog')?.addEventListener('click', () => {
  showBookDialog.close();
});

showBookDialog.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement;
  if (target.name === 'read') {
    const selectedValue = target.value === 'true';

    const bookId = showBookDialog.dataset.bookId;
    const book = libraryMap.get(bookId);

    if (book) {
      book.read = selectedValue;
    }
  }
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

  addBook(
    formData.title,
    formData.author,
    formData.pages,
    formData.read,
    formData.shelf,
  );
});

function addBook(
  title: string,
  author: string,
  pages: number,
  read: boolean,
  shelf: number,
) {
  const bgColor = getRandomColor();
  const book = new Book(
    crypto.randomUUID(),
    title,
    author,
    pages,
    read,
    shelf,
    bgColor,
    Math.floor(Math.random() * 50 + 40),
  );

  libraryMap.set(book.id, book);
  createBook(book, bgColor);
}

function createBook(book: Book, bgColor: string) {
  const bookshelfRow = document.querySelector(`.shelf-${book.shelf}`);

  const darkerColor = changeColor(bgColor, 20, true);
  const lighterColor = changeColor(bgColor, 20, false);
  const height = Math.floor(Math.random() * 20 + 60);
  const translateZ = Math.floor(Math.random() * 100) - 50;

  const bookDiv = document.createElement('div');
  bookDiv.className = `book`;
  bookDiv.id = book.id;
  bookDiv.innerHTML = `
  <div class="title">${book.title}</div>
  <div class="left" style="height:100%; background-color:${darkerColor};"></div>
  <div class="right"  style="height:100%; background-color:${darkerColor};"></div>
`;
  bookDiv.style.backgroundColor = book.color;
  bookDiv.style.color = getReadableTextColor(bgColor);
  bookDiv.style.width = book.width + 'px';
  bookDiv.style.setProperty('--outline-color', lighterColor);
  bookDiv.style.height = height + '%';

  bookDiv.dataset.zDepth = translateZ.toString();
  bookDiv.style.transform = `translateZ(${translateZ}px)`;

  bookDiv.addEventListener('click', (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    const id = target.id;
    const rect = target.getBoundingClientRect();
    const book: Book = libraryMap.get(id);
    const title = showBookDialog.querySelector('.title') as HTMLElement;
    const author = showBookDialog.querySelector('.author') as HTMLElement;
    const pages = showBookDialog.querySelector('.pages') as HTMLElement;

    showBookDialog.dataset.bookId = id;
    showBookDialog.style.position = 'absolute';
    showBookDialog.style.left = `${rect.right}px`;
    showBookDialog.style.top = `${rect.top}px`;

    title.textContent = book.title;
    author.textContent = book.author;
    pages.textContent = book.pages.toString();
    if (book.read) {
      document.querySelector<HTMLInputElement>(
        'input[type="radio"][value="true"]',
      )!.checked = true;
    } else {
      document.querySelector<HTMLInputElement>(
        'input[type="radio"][value="false"]',
      )!.checked = true;
    }
    showBookDialog.show();
  });

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

function changeColor(hex: string, percent: number, dark: boolean) {
  percent = Math.min(100, Math.max(0, percent));

  hex = hex.replace(/^#/, '');

  // Parse R, G, B
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  if (dark) {
    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));
  } else {
    r = Math.floor(r + (255 - r) * (percent / 100));
    g = Math.floor(g + (255 - g) * (percent / 100));
    b = Math.floor(b + (255 - b) * (percent / 100));
  }

  // Recombine to hex
  const newHex =
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

  return newHex;
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
